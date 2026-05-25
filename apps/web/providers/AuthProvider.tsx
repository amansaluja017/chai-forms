"use client";

import { useEffect } from "react";
import { store } from "~/app/slice/config";
import { refresh } from "~/app/slice/userSlice";
import refreshAccessToken from "~/lib/refresh";

function AuthProvider({ children }: { children: React.ReactNode }) {

    useEffect(() => {

        async function refreshToken() {
            try {
                store.dispatch(refresh({ accessToken: store.getState().user.accessToken, loading: true, user: null }));

                const response = await refreshAccessToken();

                if (response.accessToken) {
                    store.dispatch(refresh({ accessToken: response.accessToken, loading: false, user: response.user }))
                }
            } catch (error) {
                store.dispatch(refresh({ accessToken: null, loading: false, user: null }))
            } finally {
                store.dispatch(refresh({ accessToken: store.getState().user.accessToken, loading: false, user: store.getState().user.user }));
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
