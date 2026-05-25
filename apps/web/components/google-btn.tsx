"use client";

import { useEffect, useRef } from "react";
import { useGoogleLogin } from "~/hooks/api/auth/auth.hook";
import { useRouter } from "next/navigation";

export default function GoogleButton() {
    const buttonRef = useRef<HTMLDivElement>(null);
    const { loginWithGoogleOAuthAsync } = useGoogleLogin();

    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.google && buttonRef.current) {
                clearInterval(interval);

                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
                    callback: async (response: any) => {
                        const result = await loginWithGoogleOAuthAsync({ token: response.credential });

                        console.log(result, "result");
                        router.push("/dashboard");
                    },
                });

                window.google.accounts.id.renderButton(
                    buttonRef.current,
                    {
                        theme: "outline",
                        size: "large",
                    }
                );
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return <div ref={buttonRef}></div>;
};
