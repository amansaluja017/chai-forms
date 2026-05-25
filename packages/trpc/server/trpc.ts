import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

const middleware = tRPCContext.middleware(async ({ next, ctx }) => {
  if (ctx.isJwtExpired) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "JWTEXPIRED" });
  }

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next();
});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const protectedProcedure = publicProcedure.use(middleware);
