import { z, zodUndefinedModel, zodUnitModel } from "../../schema";
import { getAuthenticationMethodOutputSchema, loginWithEmailAndPasswordInputSchema, loginWithEmailAndPasswordOutputSchema, loginWithGoogleOauthInputSchema, loginWithGoogleOauthOutputSchema, passwordResetLinkInputSchema, passwordResetLinkOutputSchema, refreshAccessTokenInputSchema, refreshAccessTokenOutputSchema, registerWithEmailAndPasswordInputSchema, registerWithEmailAndPasswordOutputSchema, resend2FACodeInputSchema, resend2FACodeOutputSchema, resendVerificationEmailInputSchema, resendVerificationEmailOutputSchema, resetPasswordInputSchema, resetPasswordOutputSchema, verify2FACodeInputSchema, verify2FACodeOutputSchema, verifyEmailInputSchema, verifyEmailOutputSchema } from "@repo/services/user/model";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { enable2FAProcedure, getSupportedAuthenticationProcedure, loginWithEmailAndPasswordProcedure, loginWithGoogleOauthProcedure, logoutProcedure, passwordResetLinkProcedure, refreshAccessTokenProcedure, registerWithEmailAndPasswordProcedure, resend2FACodeProcedure, resendVerificationEmailProcedure, resetPasswordProcedure, verify2FACodeProcedure, verifyEmailProcedure } from "./procedures";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  getSupportedAuthenticationProviders: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/supported-providers"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(getSupportedAuthenticationProcedure),

  loginWithGoogleOauth: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/google/login"), tags: TAGS } })
    .input(loginWithGoogleOauthInputSchema)
    .output(loginWithGoogleOauthOutputSchema)
    .mutation(async ({ input, ctx }) => await loginWithGoogleOauthProcedure({ input, ctx })),

  loginWithEmailAndPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/login"), tags: TAGS } })
    .input(loginWithEmailAndPasswordInputSchema)
    .output(loginWithEmailAndPasswordOutputSchema)
    .mutation(async ({ input, ctx }) => await loginWithEmailAndPasswordProcedure({ input, ctx })),

  registerWithEmailAndPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/register"), tags: TAGS } })
    .input(registerWithEmailAndPasswordInputSchema)
    .output(registerWithEmailAndPasswordOutputSchema)
    .mutation(async ({ input, ctx }) => await registerWithEmailAndPasswordProcedure({ input, ctx })),

  verifyEmail: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/verify-email"), tags: TAGS } })
    .input(verifyEmailInputSchema)
    .output(verifyEmailOutputSchema)
    .mutation(async ({ input }) => await verifyEmailProcedure({ input })),

  resendVerificationEmail: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/resend-verification-email"), tags: TAGS } })
    .input(resendVerificationEmailInputSchema)
    .output(resendVerificationEmailOutputSchema)
    .mutation(async ({ input }) => await resendVerificationEmailProcedure({ input })),

  passwordResetLink: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/password-reset-link"), tags: TAGS } })
    .input(passwordResetLinkInputSchema)
    .output(passwordResetLinkOutputSchema)
    .mutation(async ({ input, ctx }) => await passwordResetLinkProcedure({ input, ctx })),

  resetPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/reset-password"), tags: TAGS } })
    .input(resetPasswordInputSchema)
    .output(resetPasswordOutputSchema)
    .mutation(async ({ input }) => await resetPasswordProcedure({ input })),

  refreshToken: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/refresh-token"), tags: TAGS } })
    .input(zodUnitModel)
    .output(refreshAccessTokenOutputSchema)
    .mutation(async ({ ctx }) => await refreshAccessTokenProcedure({ ctx })),

  toggle2FA: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/toggle-2fa"), tags: TAGS } })
    .input(z.object({}))
    .output(zodUnitModel)
    .mutation(async ({ ctx }) => await enable2FAProcedure({ ctx })),

  verify2FACode: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/verify-2fa"), tags: TAGS } })
    .input(verify2FACodeInputSchema)
    .output(verify2FACodeOutputSchema)
    .mutation(async ({ input, ctx }) => await verify2FACodeProcedure({ input, ctx })),

  logout: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/logout"), tags: TAGS } })
    .input(z.object({}))
    .output(zodUnitModel)
    .mutation(async ({ ctx }) => await logoutProcedure({ ctx })),

  resend2FACode: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/resend-2fa-code"), tags: TAGS } })
    .input(resend2FACodeInputSchema)
    .output(resend2FACodeOutputSchema)
    .mutation(async ({ input, ctx }) => await resend2FACodeProcedure({ input, ctx })),
});
