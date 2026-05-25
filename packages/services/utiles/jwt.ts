import jwt, { JsonWebTokenError, type SignOptions } from "jsonwebtoken";
import { LoginWithGoogleOauthPayloadSchema } from "../user/model";
import { env } from "../env";


function generateAccessToken(payload: LoginWithGoogleOauthPayloadSchema): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY_IN || "15m" } as SignOptions);
};

function verifyAccessToken(token: string): LoginWithGoogleOauthPayloadSchema | null {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as LoginWithGoogleOauthPayloadSchema;
    } catch (error: unknown) {
        if (error instanceof JsonWebTokenError) {
            if (error.name === "TokenExpiredError") {
                throw new Error("JWTEXPIRED");
            }
            throw new Error(error.name);
        }
        throw new Error("Invalid access token");
    }
};

function generateRefreshToken(payload: { sessionId: string }): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY_IN || "7d" } as SignOptions);
};

function verifyRefreshToken(token: string): { sessionId: string } | null {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; email: string, sessionId: string };
    } catch (error: unknown) {
        if (error instanceof JsonWebTokenError) {
            throw new Error(error.message);
        }
        throw new Error("Invalid refresh token");
    }
};


export {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
};
