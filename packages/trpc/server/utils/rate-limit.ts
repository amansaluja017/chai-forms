import { TRPCError } from "@trpc/server";
import { checkRateLimit } from "@repo/redis/src/rate-limiting";
import { Context } from "../context";

export const requireRateLimit = async (ctx: Context, action: string, limit: number, windowSecs: number) => {
  const key = ctx.fingerprint ? `rate_limit:${action}:fp:${ctx.fingerprint}` : `rate_limit:${action}:ip:${ctx.ip || 'unknown'}`;
  const { success } = await checkRateLimit(key, limit, windowSecs);
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Please try again later.",
    });
  }
};
