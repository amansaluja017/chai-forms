import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { clearCookieFactory, createCookieFactory, getCookieFactory } from "./utils/cookie";
import { verifyJwt } from "@repo/services/utiles/verifyJwt";

type TRPCContext = {
    createCookie: ReturnType<typeof createCookieFactory>
    getCookie: ReturnType<typeof getCookieFactory>
    clearCookie: ReturnType<typeof clearCookieFactory>
    user?: Awaited<ReturnType<typeof verifyJwt>> | null;
    isJwtExpired?: boolean;
    fingerprint: string | null;
    ip: string | null;
};

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<TRPCContext> {

    const accessToken = req.headers["authorization"];
    let user;
    let isJwtExpired = false;

    if (accessToken) {
        try {
            user = await verifyJwt(req);
        } catch (error) {
            if (error instanceof Error && error.message === "JWTEXPIRED") {
                isJwtExpired = true;
            }
            console.error("JWT Verify Error:", error);
        }
    } else {
        user = null;
    }

    const ctx: TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
        user,
        isJwtExpired,
        fingerprint: (req.headers["x-device-fingerprint"] as string) || null,
        ip: req.ip || req.socket?.remoteAddress || null,
    };

    return ctx;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
