"use client";

import { useEffect } from "react";
import { store } from "~/app/slice/config";
import { refresh } from "~/app/slice/userSlice";
import refreshAccessToken from "~/lib/refresh";

function AuthProvider({ children }: { children: React.ReactNode }) {

    useEffect(() => {

        async function refreshToken() {
            try {
                store.dispatch(refresh({ accessToken: store.getState().user.accessToken, loading: true }));

                const response = await refreshAccessToken();

                if (response.accessToken) {
                    store.dispatch(refresh({ accessToken: response.accessToken, loading: false }))
                }
            } catch (error) {
                console.log("Not authenticated", error);
                store.dispatch(refresh({ accessToken: null, loading: false }))
            } finally {
                store.dispatch(refresh({ accessToken: store.getState().user.accessToken, loading: false }));
            }
        }

        refreshToken();
    }, []);

    return (
        <>
            {children}
        </>
    )
};

export default AuthProvider;
