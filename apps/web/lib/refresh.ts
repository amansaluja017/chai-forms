import type { User } from "@repo/services/user/model";

export default async function refreshAccessToken(): Promise<{
    accessToken: string | null;
    user: User | null;
}> {
    try {
        const response = await fetch("http://localhost:8000/api/authentication/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({}),
        });
        const data = await response.json();

        return { accessToken: data.accessToken, user: data.user };
    } catch (error) {
        return { accessToken: null, user: null };
    }

};
