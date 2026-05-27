import { LoginWithEmailAndPasswordInputType, LoginWithGoogleOauthInputSchema, LogoutInputType, PasswordResetLinkInputType, RegisterWithEmailAndPasswordInputType, Resend2FACodeInputType, ResendVerificationEmailInputType, ResetPasswordInputType, Verify2FACodeInputType, VerifyEmailInputType } from "@repo/services/user/model";
import { userService } from "../../services";
import { Context } from "../../context";
import { TRPCError } from "@trpc/server";
import { checkRateLimit } from "@repo/redis/src/rate-limiting";

const requireRateLimit = async (ctx: Context, action: string, limit: number, windowSecs: number) => {
  const key = ctx.fingerprint ? `rate_limit:${action}:fp:${ctx.fingerprint}` : `rate_limit:${action}:ip:${ctx.ip || 'unknown'}`;
  const { success } = await checkRateLimit(key, limit, windowSecs);
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Please try again later.",
    });
  }
};


export const getSupportedAuthenticationProcedure = async () => {
  const supportedMethods = await userService.getAuthenticationMethods();
  return supportedMethods;
};

export const loginWithGoogleOauthProcedure = async ({ input, ctx }: { input: LoginWithGoogleOauthInputSchema, ctx: Context }) => {
  const { token } = input;

  const { user, accessToken, refreshToken } = await userService.loginWithGoogleOauth(token);

  ctx.createCookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  return { user, accessToken, refreshToken };
};

export const loginWithEmailAndPasswordProcedure = async ({ input, ctx }: { input: LoginWithEmailAndPasswordInputType, ctx: Context }) => {
  await requireRateLimit(ctx, "login", 5, 60);

  const { user, accessToken, refreshToken, is2FAEnabled } = await userService.loginWithEmailAndPassword(input);

  if (is2FAEnabled) {
    return { user, is2FAEnabled };
  };

  ctx.createCookie("refreshToken", refreshToken!, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  return { user, accessToken, is2FAEnabled: false };
};

export const resend2FACodeProcedure = async ({ input, ctx }: { input: Resend2FACodeInputType, ctx: Context }) => {
  await requireRateLimit(ctx, "resend2fa", 3, 3600);
  
  const { id, is2FAEnabled } = await userService.resend2FACode(input);

  return { id, is2FAEnabled };
};

export const registerWithEmailAndPasswordProcedure = async ({ input, ctx }: { input: RegisterWithEmailAndPasswordInputType, ctx: Context }) => {
  await requireRateLimit(ctx, "signup", 3, 3600);

  const { id } = await userService.registerWithEmailAndPassword(input);

  return { id };
};

export const verifyEmailProcedure = async ({ input }: { input: VerifyEmailInputType }) => {
  await userService.verifyEmail(input);
};

export const resendVerificationEmailProcedure = async ({ input }: { input: ResendVerificationEmailInputType }) => {
  await userService.resendVerificationEmail(input);
};

export const passwordResetLinkProcedure = async ({ input, ctx }: { input: PasswordResetLinkInputType, ctx: Context }) => {
  await requireRateLimit(ctx, "password_reset", 3, 3600);
  await userService.passwordResetLink(input);
};

export const resetPasswordProcedure = async ({ input }: { input: ResetPasswordInputType }) => {
  await userService.resetPassword(input);
};

export const refreshAccessTokenProcedure = async ({ ctx }: { ctx: Context }) => {
  const refreshToken = ctx.getCookie("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const { user, accessToken, refreshToken: newRefreshToken } = await userService.refreshAccessToken(refreshToken);
  
  ctx.createCookie("refreshToken", newRefreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  
  return { user, accessToken };
};

export const enable2FAProcedure = async ({ ctx }: { ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }

  const refreshToken = ctx.getCookie("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  await userService.toggle2FA({ refreshToken });
};

export const verify2FACodeProcedure = async ({ input, ctx }: { input: Verify2FACodeInputType, ctx: Context }) => {
  const { id, twoFACode } = input;

  const { user, accessToken, refreshToken } = await userService.verify2FACode({ id, twoFACode });

  ctx.createCookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  return { user, accessToken };
}

export const logoutProcedure = async ({ ctx }: { ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }

  const refreshToken = ctx.getCookie("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  await userService.logout({ refreshToken });

  ctx.clearCookie("refreshToken");
}
