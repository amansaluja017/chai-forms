import type { Response, CookieOptions, Request } from "express";

type TRPCCookieTypes = CookieOptions & {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    path?: string;
};

type cookieTypes = "refreshToken";

export function createCookieFactory(res: Response) {
    return function setCookie(name: cookieTypes, value: string, opts: TRPCCookieTypes) {
        res.cookie(name, value, opts);
    };
};

export function getCookieFactory(req: Request) {
    return function getCookie(name: cookieTypes) {
        return req.cookies[name];
    };
};

export function clearCookieFactory(res: Response) {
    return function clearCookie(name: cookieTypes) {
        res.clearCookie(name);
    };
};
