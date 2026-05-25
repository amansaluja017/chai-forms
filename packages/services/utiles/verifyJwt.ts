import { NextFunction, Request } from "express";
import db, { eq } from "@repo/database";
import { verifyAccessToken } from "./jwt";
import { usersTable } from "@repo/database/schema";


export async function verifyJwt(req: Request) {

    const token = req.headers["authorization"];

    if (!token || typeof token !== "string") {
        throw new Error("Token not found");
    };

    const [tokenType, tokenValue] = token.split(" ");

    if (tokenType !== "Bearer" || !tokenValue) {
        throw new Error("Invalid token");
    };

    try {

        const decodedToken = verifyAccessToken(tokenValue);

        if (!decodedToken) {
            throw new Error("Invalid token");
        };

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decodedToken.id)).limit(1);

        if (!user) {
            throw new Error("User not found");
        };


        return user;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Invalid token");
    }

};
