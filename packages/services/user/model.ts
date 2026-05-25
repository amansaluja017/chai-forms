import { z } from "zod";

export const getAuthenticationMethodOutputSchema = z.object({
  provider: z.enum(["GOOGLE_OAUTH", "EMAIL"]),
  displayName: z.string().describe("Display name of the authentication provider."),
  displayText: z.string().describe("Display text of the authentication provider."),
  authUrl: z.url().optional().describe("Authentication URL."),
}).describe("Supported authentication methods.");

export const loginWithGoogleOauthPayloadSchema = z.object({
  id: z.string().describe("Id of the user."),
  email: z.string().describe("Email of the user."),
});

export const loginWithGoogleOauthInputSchema = z.object({
  token: z.string().describe("Google OAuth token."),
});

export const loginWithGoogleOauthOutputSchema = z.object({
  id: z.string().describe("Id of the user."),
  accessToken: z.string().describe("Access token."),
});

export const loginWithEmailAndPasswordInputSchema = z.object({
  email: z.string().email().describe("Email of the user."),
  password: z.string().describe("Password of the user."),
});

export const loginWithEmailAndPasswordOutputSchema = z.object({
  id: z.string().describe("Id of the user."),
  accessToken: z.string().optional().describe("Access token."),
  refreshToken: z.string().optional().describe("Refresh token."),
  is2FAEnabled: z.boolean().describe("Whether 2FA is enabled or not."),
});

export const registerWithEmailAndPasswordInputSchema = z.object({
  firstName: z.string().describe("First name of the user."),
  lastName: z.string().describe("Last name of the user."),
  email: z.string().email().describe("Email of the user."),
  password: z.string().describe("Password of the user."),
});

export const registerWithEmailAndPasswordOutputSchema = z.object({
  id: z.string().describe("Id of the user.")
});

export const verifyEmailInputSchema = z.object({
  token: z.string().describe("Token to verify email.")
});

export const verifyEmailOutputSchema = z.void();

export const resendVerificationEmailInputSchema = z.object({
  email: z.string().email().describe("Email of the user."),
});

export const resendVerificationEmailOutputSchema = z.void();

export const passwordResetLinkInputSchema = z.object({
  email: z.string().email().describe("Email of the user."),
});

export const passwordResetLinkOutputSchema = z.void();

export const resetPasswordInputSchema = z.object({
  token: z.string().describe("Token to reset password."),
  password: z.string().describe("New password of the user."),
  confirmPassword: z.string().describe("Confirm new password of the user."),
});

export const resetPasswordOutputSchema = z.void();

export const refreshAccessTokenInputSchema = z.string().describe("refresh token");

export const refreshAccessTokenOutputSchema = z.object({
  accessToken: z.string().describe("Access token."),
});

export const profileInputSchema = z.object({
  accessToken: z.string().describe("Access token."),
});

export const profileOutputSchema = z.object({
  id: z.string().describe("Id of the user."),
  fullName: z.string().describe("Full name of the user."),
  email: z.string().email().describe("Email of the user."),
  profileImageUrl: z.string().url().nullable().describe("Profile image URL of the user."),
  emailVerified: z.boolean().describe("Email verification status of the user."),
  provider: z.enum(["google", "local"]).describe("Provider of the user."),
  is2FAEnabled: z.boolean().describe("Whether 2FA is enabled or not."),
});

export const enable2FAInputSchema = z.object({
  email: z.string().email().describe("Email of the user."),
});

export const enable2FAOutputSchema = z.object({
  totpSecret: z.string().describe("2FA secret."),
});

export const verify2FACodeInputSchema = z.object({
  twoFACode: z.string().describe("2FA code."),
  id: z.string().describe("Id of the user."),
});

export const verify2FACodeOutputSchema = z.object({
  id: z.string().describe("Id of the user."),
  accessToken: z.string().describe("Access token."),
});

export const logoutInputSchema = z.object({
  refreshToken: z.string().describe("Refresh token."),
});

export const resend2FACodeInputSchema = z.object({
  email: z.string().email().describe("Email of the user."),
});

export const resend2FACodeOutputSchema = z.object({
  id: z.string().describe("Id of the user."),
  is2FAEnabled: z.boolean().describe("Whether 2FA is enabled or not."),
});

export const logoutOutputSchema = z.void();

export type GetAuthenticationMethodOutputSchema = z.infer<
  typeof getAuthenticationMethodOutputSchema
>;

export type LoginWithGoogleOauthPayloadSchema = z.infer<
  typeof loginWithGoogleOauthPayloadSchema
>;

export type LoginWithGoogleOauthInputSchema = z.infer<
  typeof loginWithGoogleOauthInputSchema
>;

export type LoginWithGoogleOauthOutputSchema = z.infer<
  typeof loginWithGoogleOauthOutputSchema
>;

export type LoginWithEmailAndPasswordInputType = z.infer<
  typeof loginWithEmailAndPasswordInputSchema
>;

export type LoginWithEmailAndPasswordOutputType = z.infer<
  typeof loginWithEmailAndPasswordOutputSchema
>;

export type RegisterWithEmailAndPasswordInputType = z.infer<
  typeof registerWithEmailAndPasswordInputSchema
>;

export type RegisterWithEmailAndPasswordOutputType = z.infer<
  typeof registerWithEmailAndPasswordOutputSchema
>;

export type VerifyEmailInputType = z.infer<
  typeof verifyEmailInputSchema
>;

export type ResendVerificationEmailInputType = z.infer<
  typeof resendVerificationEmailInputSchema
>;

export type ResendVerificationEmailOutputType = z.infer<
  typeof resendVerificationEmailOutputSchema
>;

export type PasswordResetLinkInputType = z.infer<
  typeof passwordResetLinkInputSchema
>;

export type PasswordResetLinkOutputType = z.infer<
  typeof passwordResetLinkOutputSchema
>;

export type ResetPasswordInputType = z.infer<
  typeof resetPasswordInputSchema
>;

export type ResetPasswordOutputType = z.infer<
  typeof resetPasswordOutputSchema
>;

export type RefreshAccessTokenInputType = z.infer<
  typeof refreshAccessTokenInputSchema
>;

export type RefreshAccessTokenOutputType = z.infer<
  typeof refreshAccessTokenOutputSchema
>;

export type ProfileInputType = z.infer<
  typeof profileInputSchema
>;

export type ProfileOutputType = z.infer<
  typeof profileOutputSchema
>;

export type Enable2FAInputType = z.infer<
  typeof enable2FAInputSchema
>;

export type Enable2FAOutputType = z.infer<
  typeof enable2FAOutputSchema
>;

export type Verify2FACodeInputType = z.infer<
  typeof verify2FACodeInputSchema
>;

export type Verify2FACodeOutputType = z.infer<
  typeof verify2FACodeOutputSchema
>;

export type LogoutInputType = z.infer<
  typeof logoutInputSchema
>;

export type LogoutOutputType = z.infer<
  typeof logoutOutputSchema
>;

export type Resend2FACodeInputType = z.infer<
  typeof resend2FACodeInputSchema
>;

export type Resend2FACodeOutputType = z.infer<
  typeof resend2FACodeOutputSchema
>;
