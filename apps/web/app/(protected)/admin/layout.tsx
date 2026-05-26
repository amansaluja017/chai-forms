"use client"

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "~/app/slice/config";


function AdminLayout({ children }: { children: React.ReactNode }) {
    const { accessToken, loading, user } = useSelector((state: RootState) => state.user);

    const router = useRouter();

    if (loading) {
        return <div>loading...</div>
    }

    if (!accessToken || user?.role !== "admin") {
        router.push("/login");
        return null;
    };

    return (
        <>
            {children}
        </>
    )
};


export default AdminLayout;
