import { LoginWithEmailAndPasswordInputType, LoginWithGoogleOauthInputSchema, LogoutInputType, PasswordResetLinkInputType, ProfileInputType, RegisterWithEmailAndPasswordInputType, Resend2FACodeInputType, ResendVerificationEmailInputType, ResetPasswordInputType, Verify2FACodeInputType, VerifyEmailInputType } from "@repo/services/user/model";
import { userService } from "../../services";
import { Context } from "../../context";


export const getSupportedAuthenticationProcedure = async () => {
  const supportedMethods = await userService.getAuthenticationMethods();
  return supportedMethods;
};

export const loginWithGoogleOauthProcedure = async ({ input, ctx }: { input: LoginWithGoogleOauthInputSchema, ctx: Context }) => {
  const { token } = input;

  const { id, accessToken, refreshToken } = await userService.loginWithGoogleOauth(token);

  ctx.createCookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  return { id, accessToken, is2FAEnabled: true };
};

export const loginWithEmailAndPasswordProcedure = async ({ input, ctx }: { input: LoginWithEmailAndPasswordInputType, ctx: Context }) => {
  const { id, accessToken, refreshToken, is2FAEnabled } = await userService.loginWithEmailAndPassword(input);

  if (is2FAEnabled) {
    return { id, is2FAEnabled };
  };

  ctx.createCookie("refreshToken", refreshToken!, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  return { id, accessToken, is2FAEnabled: false };
};

export const resend2FACodeProcedure = async ({ input }: { input: Resend2FACodeInputType }) => {
  const { id, is2FAEnabled } = await userService.resend2FACode(input);

  return { id, is2FAEnabled };
};

export const registerWithEmailAndPasswordProcedure = async ({ input }: { input: RegisterWithEmailAndPasswordInputType }) => {
  const { id } = await userService.registerWithEmailAndPassword(input);

  return { id };
};

export const verifyEmailProcedure = async ({ input }: { input: VerifyEmailInputType }) => {
  await userService.verifyEmail(input);
};

export const resendVerificationEmailProcedure = async ({ input }: { input: ResendVerificationEmailInputType }) => {
  await userService.resendVerificationEmail(input);
};

export const passwordResetLinkProcedure = async ({ input }: { input: PasswordResetLinkInputType }) => {
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

  const { id, accessToken, refreshToken: newRefreshToken } = await userService.refreshAccessToken(refreshToken);
  
  ctx.createCookie("refreshToken", newRefreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });
  
  return { id, accessToken };
};

export const profileProcedure = async ({ ctx }: { ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }

  const { id, fullName, email, profileImageUrl, emailVerified, provider, is2FAEnabled } = ctx.user;

  return { id, fullName, email, profileImageUrl, emailVerified, provider, is2FAEnabled };
}

export const enable2FAProcedure = async ({ ctx }: { ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }

  const { email } = ctx.user;

  await userService.toggle2FA({ email });
};

export const verify2FACodeProcedure = async ({ input, ctx }: { input: Verify2FACodeInputType, ctx: Context }) => {
  const { id, twoFACode } = input;

  const { id: userId, accessToken, refreshToken } = await userService.verify2FACode({ id, twoFACode });

  ctx.createCookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  return { id: userId, accessToken };
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
