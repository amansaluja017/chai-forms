import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { clearCookieFactory, createCookieFactory, getCookieFactory } from "./utils/cookie";
import { verifyJwt } from "@repo/services/utiles/verifyJwt";

type TRPCContext = {
    createCookie: ReturnType<typeof createCookieFactory>
    getCookie: ReturnType<typeof getCookieFactory>
    clearCookie: ReturnType<typeof clearCookieFactory>
    user?: Awaited<ReturnType<typeof verifyJwt>> | null;
    isJwtExpired?: boolean;
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
            console.log(error);
        }
    } else {
        user = null;
    }

    const ctx: TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
        user,
        isJwtExpired
    };

    return ctx;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
