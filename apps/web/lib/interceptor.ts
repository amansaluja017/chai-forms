import { store } from "~/app/slice/config";
import refreshAccessToken from "./refresh";
import { refresh } from "~/app/slice/userSlice";

export async function customFetch(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  let token = store.getState().user.accessToken;

  let response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: token
        ? `Bearer ${token}`
        : "",
    },
    credentials: "include",
  });

  if (response.status === 401) {
    const cloned = response.clone();
    try {
      const body = await cloned.json();
      if (JSON.stringify(body).includes("JWTEXPIRED")) {
        const { accessToken, user } = await refreshAccessToken();
        
        if (accessToken) {
          store.dispatch(refresh({ accessToken, loading: false, user }));

          response = await fetch(input, {
            ...init,
            headers: {
              ...init?.headers,
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          });
        }
      }
    } catch (e) {
      console.error("Error parsing 401 response", e);
    }
  }

  return response;
};
