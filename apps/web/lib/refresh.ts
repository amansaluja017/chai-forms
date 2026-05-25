
export default async function refreshAccessToken(): Promise<{
    accessToken: string;
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

        return { accessToken: data.accessToken };
    } catch (error) {
        console.log(error);

        return { accessToken: "" };
    }

};
