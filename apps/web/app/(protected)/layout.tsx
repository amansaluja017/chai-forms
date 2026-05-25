"use client"

import { useSelector } from "react-redux";
import { RootState } from "../slice/config";
import { useRouter } from "next/navigation";


function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { accessToken, loading } = useSelector((state: RootState) => state.user);

    const router = useRouter();

    if (loading) {
        return <div>loading...</div>
    }

    if (!accessToken) {
        router.push("/login")
    };

    return (
        <>
            {children}
        </>
    )
};


export default ProtectedLayout;
