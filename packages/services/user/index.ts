import { and, db, eq, gte } from "@repo/database";
import { tokensTable, usersTable } from "@repo/database/schema";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import { enable2FAInputSchema, Enable2FAInputType, GetAuthenticationMethodOutputSchema, loginWithEmailAndPasswordInputSchema, LoginWithEmailAndPasswordInputType, logoutInputSchema, LogoutInputType, passwordResetLinkInputSchema, PasswordResetLinkInputType, profileInputSchema, ProfileInputType, refreshAccessTokenInputSchema, RefreshAccessTokenInputType, registerWithEmailAndPasswordInputSchema, RegisterWithEmailAndPasswordInputType, RegisterWithEmailAndPasswordOutputType, resend2FACodeInputSchema, Resend2FACodeInputType, resendVerificationEmailInputSchema, ResendVerificationEmailInputType, resetPasswordInputSchema, ResetPasswordInputType, verify2FACodeInputSchema, Verify2FACodeInputType, verifyEmailInputSchema, VerifyEmailInputType } from "./model";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { sendEmail, verificationMail, forgotPasswordMail, enable2FAMail } from "@repo/email"
import { logger } from "@repo/logger";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utiles/jwt";
import { client } from "@repo/redis";


class UserService {
  private generateHash(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  private generate2FACode() {
    return crypto.randomInt(100000, 999999).toString();
  };

  private async existingUserWithEmail(email: string) {
    const [existedUser] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    return existedUser;
  };

  private async sendCode(email: string, id: string, name: string) {
    const code = this.generate2FACode();

    await client.set(
      `two-factor-code:${id}`,
      this.generateHash(code),
      { EX: 5 * 60 * 1000 }
    );

    const mail2FA = enable2FAMail(name, code);
    sendEmail(email, "Enable 2FA", mail2FA).catch((error) => {
      logger.error(error);
      throw new Error("Failed to send 2FA email");
    });
  }

  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchema>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] = [];

    const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

    if (isGoogleConfigured) {
      const url = googleOAuth2Client.generateAuthUrl();
      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Signin with Google",
        authUrl: url,
      });
    }

    supportedAuthenticationProviders.push({
      provider: "EMAIL",
      displayName: "Email",
      displayText: "Signin with Email",
    });

    return supportedAuthenticationProviders;
  }

  public async loginWithGoogleOauth(token: string) {
    const response = await googleOAuth2Client.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_OAUTH_CLIENT_ID
    });

    const payload = response.getPayload();

    if (!payload) {
      throw new Error("Invalid Google OAuth token");
    }

    const { email, name, picture, email_verified } = payload;

    if (!email || !name || !picture || !email_verified) {
      throw new Error("Invalid Google OAuth token");
    };

    let existedUser = await this.existingUserWithEmail(email);

    let id: string;

    if (!existedUser) {
      const user = await db.insert(usersTable).values({
        email,
        profileImageUrl: picture,
        emailVerified: email_verified,
        provider: "google",
        fullName: name,
      }).returning();

      if (!user[0]) {
        throw new Error("Failed to create user");
      };

      id = user[0].id;
      existedUser = user[0];
    } else {
      id = existedUser.id;
    };

    const sessionId = crypto.randomUUID();

    const { password: _, ...restUser } = existedUser;

    await client.set(
      `user-session:${sessionId}`,
      JSON.stringify({ user: restUser }),
      { EX: 7 * 24 * 60 * 60 * 1000 }
    );

    const accessToken = generateAccessToken({ id, email });
    const refreshToken = generateRefreshToken({ sessionId });

    return { user: restUser as any, accessToken, refreshToken };
  };

  public async loginWithEmailAndPassword(input: LoginWithEmailAndPasswordInputType) {
    const { email, password } = loginWithEmailAndPasswordInputSchema.parse(input);

    const existedUser = await this.existingUserWithEmail(email);

    if (!existedUser) {
      throw new Error("No user found with this email");
    };

    if (existedUser.provider !== "local") {
      throw new Error("User is not registered with email");
    };

    const isPasswordValid = await bcrypt.compare(password, existedUser.password!);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    };

    if (!existedUser.emailVerified) {
      throw new Error("Email not verified");
    };

    if (existedUser.is2FAEnabled) {
      await this.sendCode(email, existedUser.id, existedUser.fullName);

      return { user: existedUser, is2FAEnabled: true };
    };

    const sessionId = crypto.randomUUID();

    const accessToken = generateAccessToken({ id: existedUser.id, email: existedUser.email });
    const refreshToken = generateRefreshToken({ sessionId });

    const { password: _, ...restUser } = existedUser;

    await client.set(
      `user-session:${sessionId}`,
      JSON.stringify({ user: restUser }),
      { EX: 7 * 24 * 60 * 60 * 1000 }
    );

    return { user: restUser as any, accessToken, refreshToken, is2FAEnabled: false };
  };

  public async resend2FACode(input: Resend2FACodeInputType) {
    const { email } = resend2FACodeInputSchema.parse(input);

    const existedUser = await this.existingUserWithEmail(email);

    if (!existedUser) {
      throw new Error("No user found with this email");
    };

    if (!existedUser.is2FAEnabled) {
      throw new Error("2FA is not enabled");
    };

    await this.sendCode(email, existedUser.id, existedUser.fullName);

    return { id: existedUser.id, is2FAEnabled: true };
  };

  public async registerWithEmailAndPassword(input: RegisterWithEmailAndPasswordInputType) {
    const { email, password, firstName, lastName } = registerWithEmailAndPasswordInputSchema.parse(input);

    const existedUser = await this.existingUserWithEmail(email);

    if (existedUser) {
      throw new Error("User already exists");
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.transaction(async (tx) => {

      const [user] = await tx.insert(usersTable).values({
        fullName: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        provider: "local",
      }).returning({ id: usersTable.id, fullName: usersTable.fullName });

      if (!user) {
        throw new Error("Failed to create user");
      };

      const token = this.generateToken();
      const hashToken = this.generateHash(token);

      await tx.insert(tokensTable).values({
        token: hashToken,
        tokenType: "verificationToken",
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      const verificationLink = `http://localhost:3000/verify-email/${token}`;
      const mail = verificationMail(user.fullName, verificationLink);
      sendEmail(email, "Verify Your Email", mail).catch((error) => {
        logger.error(error);
        throw new Error("Failed to send verification email");
      });

      return { id: user.id };
    });

    return { id: result.id };
  }

  public async verifyEmail(input: VerifyEmailInputType) {
    const { token } = verifyEmailInputSchema.parse(input);

    const hashToken = this.generateHash(token);

    try {
      await db.transaction(async (tx) => {
        const [verificationToken] = await tx.update(tokensTable).set({
          revoked: true
        }).where(and(
          eq(tokensTable.token, hashToken),
          eq(tokensTable.tokenType, "verificationToken"),
          eq(tokensTable.revoked, false),
          gte(tokensTable.expiresAt, new Date())
        )).returning({ userId: tokensTable.userId });

        if (!verificationToken) {
          throw new Error("Invalid or expired token");
        };

        await tx.update(usersTable).set({
          emailVerified: true,
        }).where(eq(usersTable.id, verificationToken.userId));
      })
    } catch (error: any) {
      logger.error("Error verifying email", { error });
      throw new Error(error.message);
    }
  }

  public async resendVerificationEmail(input: ResendVerificationEmailInputType) {
    const { email } = resendVerificationEmailInputSchema.parse(input);

    const existedUser = await this.existingUserWithEmail(email);

    if (!existedUser) {
      throw new Error("No user found with this email");
    };

    if (existedUser.emailVerified) {
      throw new Error("Email already verified");
    };

    const token = this.generateToken();
    const hashToken = this.generateHash(token);

    await db.insert(tokensTable).values({
      token: hashToken,
      tokenType: "verificationToken",
      userId: existedUser.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const verificationLink = `${env.CLIENT_API_URL}/verify-email/${token}`;
    const mail = verificationMail(existedUser.fullName, verificationLink);
    sendEmail(email, "Verify Your Email", mail).catch((error) => {
      logger.error(error);
      throw new Error("Failed to send verification email");
    });
  }

  public async passwordResetLink(input: PasswordResetLinkInputType) {
    const { email } = passwordResetLinkInputSchema.parse(input);

    const existedUser = await this.existingUserWithEmail(email);

    if (!existedUser) {
      throw new Error("No user found with this email");
    };

    const token = this.generateToken();
    const hashToken = this.generateHash(token);

    await db.insert(tokensTable).values({
      token: hashToken,
      tokenType: "passwordResetToken",
      userId: existedUser.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const passwordResetLink = `${env.CLIENT_API_URL}/reset-password/${token}`;
    const mail = forgotPasswordMail(existedUser.fullName, passwordResetLink);
    sendEmail(email, "Reset Password", mail).catch((error) => {
      logger.error(error);
      throw new Error("Failed to send password reset email");
    });
  }

  public async resetPassword(input: ResetPasswordInputType) {
    const { token, password, confirmPassword } = resetPasswordInputSchema.parse(input);

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    };

    const hashToken = this.generateHash(token);

    try {
      await db.transaction(async (tx) => {
        const [passwordResetToken] = await tx.update(tokensTable).set({
          revoked: true
        }).where(and(
          eq(tokensTable.token, hashToken),
          eq(tokensTable.tokenType, "passwordResetToken"),
          eq(tokensTable.revoked, false),
          gte(tokensTable.expiresAt, new Date())
        )).returning({ userId: tokensTable.userId });

        if (!passwordResetToken) {
          throw new Error("Invalid or expired token");
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        await tx.update(usersTable).set({
          password: hashedPassword,
        }).where(eq(usersTable.id, passwordResetToken.userId));
      })
    } catch (error: any) {
      logger.error("Error resetting password", { error });
      throw new Error(error.message);
    }
  }

  public async refreshAccessToken(input: RefreshAccessTokenInputType) {
    const refreshToken = refreshAccessTokenInputSchema.parse(input);

    const decodedToken = verifyRefreshToken(refreshToken);

    if (!decodedToken) {
      throw new Error("Invalid or expired token");
    };

    const { sessionId } = decodedToken;

    const session = await client.get(`user-session:${sessionId}`);

    if (!session) {
      throw new Error("Invalid or expired token");
    };

    const { user } = JSON.parse(session);

    const newSessionId = crypto.randomUUID();

    await client.set(`user-session:${newSessionId}`, JSON.stringify({ user }), {
      EX: 7 * 24 * 60 * 60 * 1000,
    });

    await client.del(`user-session:${sessionId}`);

    const newAccessToken = generateAccessToken({ id: user.id, email: user.email });
    const newRefreshToken = generateRefreshToken({ sessionId: newSessionId });

    return { user: user as any, accessToken: newAccessToken, refreshToken: newRefreshToken };

  } catch(error: any) {
    logger.error("Error refreshing access token", { error });
    throw new Error(error.message);
  };

  public async toggle2FA(input: Enable2FAInputType) {
    const { refreshToken } = enable2FAInputSchema.parse(input);

    const decodedToken = verifyRefreshToken(refreshToken);

    if (!decodedToken) {
      throw new Error("Invalid or expired token");
    };

    const { sessionId } = decodedToken;

    const session = await client.get(`user-session:${sessionId}`);

    if (!session) {
      throw new Error("Invalid or expired token");
    };

    const { user } = JSON.parse(session);

    const [updatedUser] = await db.update(usersTable).set({
      is2FAEnabled: !user.is2FAEnabled,
    }).where(eq(usersTable.id, user.id)).returning({ id: usersTable.id, is2FAEnabled: usersTable.is2FAEnabled, email: usersTable.email, fullName: usersTable.fullName, profileImageUrl: usersTable.profileImageUrl, emailVerified: usersTable.emailVerified, provider: usersTable.provider, createdAt: usersTable.createdAt, updatedAt: usersTable.updatedAt, role: usersTable.role });

    if (!updatedUser) {
      throw new Error("No user found with this email");
    };

    await client.set(`user-session:${sessionId}`, JSON.stringify({ user: updatedUser }), {
      KEEPTTL: true
    });
  };

  public async verify2FACode(input: Verify2FACodeInputType) {
    const { twoFACode, id } = verify2FACodeInputSchema.parse(input);

    const [existedUser] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

    if (!existedUser) {
      throw new Error("No user found with this email");
    };

    const code = await client.get(`two-factor-code:${id}`);

    if (!code) {
      throw new Error("Invalid 2FA code");
    };

    if (code !== this.generateHash(twoFACode)) {
      throw new Error("Invalid 2FA code");
    };

    await client.del(`two-factor-code:${id}`);

    const sessionId = crypto.randomUUID();

    const { password: _, ...restUser } = existedUser;

    await client.set(`user-session:${sessionId}`, JSON.stringify({ user: restUser }), {
      EX: 7 * 24 * 60 * 60 * 1000,
    });

    const accessToken = generateAccessToken({ id: existedUser.id, email: existedUser.email });
    const refreshToken = generateRefreshToken({ sessionId });

    return { user: restUser as any, accessToken, refreshToken };
  };

  public async logout(input: LogoutInputType) {
    const { refreshToken } = logoutInputSchema.parse(input);

    const decodedToken = verifyRefreshToken(refreshToken);

    if (!decodedToken) {
      throw new Error("Invalid or expired token");
    };

    const { sessionId } = decodedToken;

    await client.del(`user-session:${sessionId}`);
  };

};

export default UserService;
