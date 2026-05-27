export function verificationMail(name: string, verificationLink: string) {
  const mailString = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: 0 auto; border: 1px solid #f3f4f6;">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="background: #eff6ff; width: 64px; height: 64px; border-radius: 50%; margin: 0 auto; padding: 12px; box-sizing: border-box; margin-bottom: 24px;">
                      <span style="font-size: 32px; line-height: 1;">✉️</span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">Verify your email</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 0 40px 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    <p style="margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
                    <p style="margin-bottom: 32px;">
                      Welcome! We're excited to have you on board. To get started, please verify your email address by clicking the button below.
                    </p>
                    <div style="text-align: center; margin-bottom: 32px;">
                      <a href="${verificationLink}" style="background-color: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                        Verify Email Address
                      </a>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">
                      This link will expire in <strong>15 minutes</strong>. If you didn't create an account, you can safely ignore this email.
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin: 0;">
                      Having trouble? Copy and paste this link into your browser:<br/>
                      <a href="${verificationLink}" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${verificationLink}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 14px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} Your App. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return mailString;
}

export function forgotPasswordMail(name: string, verificationLink: string) {
  const mailString = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: 0 auto; border: 1px solid #f3f4f6;">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="background: #fef2f2; width: 64px; height: 64px; border-radius: 50%; margin: 0 auto; padding: 12px; box-sizing: border-box; margin-bottom: 24px;">
                      <span style="font-size: 32px; line-height: 1;">🔑</span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">Reset your password</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 0 40px 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    <p style="margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
                    <p style="margin-bottom: 32px;">
                      We received a request to reset your password. Click the button below to securely set a new password for your account.
                    </p>
                    <div style="text-align: center; margin-bottom: 32px;">
                      <a href="${verificationLink}" style="background-color: #ef4444; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                        Reset Password
                      </a>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">
                      This link will expire in <strong>15 minutes</strong> for your security. If you didn't request a password reset, you can safely ignore this email.
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin: 0;">
                      Having trouble? Copy and paste this link into your browser:<br/>
                      <a href="${verificationLink}" style="color: #ef4444; text-decoration: underline; word-break: break-all;">${verificationLink}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 14px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} Your App. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return mailString;
}

export function enable2FAMail(name: string, verificationLink: string) {
  const mailString = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Enable 2FA</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: 0 auto; border: 1px solid #f3f4f6;">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="background: #f0fdf4; width: 64px; height: 64px; border-radius: 50%; margin: 0 auto; padding: 12px; box-sizing: border-box; margin-bottom: 24px;">
                      <span style="font-size: 32px; line-height: 1;">🛡️</span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">Enable Two-Factor Auth</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 0 40px 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    <p style="margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
                    <p style="margin-bottom: 32px;">
                      You are one step away from securing your account. Click the button below to enable Two-Factor Authentication (2FA) and protect your data.
                    </p>
                    <div style="text-align: center; margin-bottom: 32px;">
                      <a href="${verificationLink}" style="background-color: #10b981; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                        Enable 2FA
                      </a>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">
                      This link will expire in <strong>15 minutes</strong> for your security. If you didn't request this change, you can safely ignore this email and your settings will remain unchanged.
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin: 0;">
                      Having trouble? Copy and paste this link into your browser:<br/>
                      <a href="${verificationLink}" style="color: #10b981; text-decoration: underline; word-break: break-all;">${verificationLink}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 14px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} Your App. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return mailString;
}

export function formDeletionMail(name: string, formTitle: string, reason: string) {
  const mailString = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Form Deleted</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: 0 auto; border: 1px solid #f3f4f6;">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="background: #fef2f2; width: 64px; height: 64px; border-radius: 50%; margin: 0 auto; padding: 12px; box-sizing: border-box; margin-bottom: 24px;">
                      <span style="font-size: 32px; line-height: 1;">⚠️</span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">Form Deleted by Admin</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 0 40px 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    <p style="margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
                    <p style="margin-bottom: 20px;">
                      We are writing to inform you that your form <strong>"${formTitle}"</strong> has been deleted by an administrator.
                    </p>
                    <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
                      <p style="margin: 0; font-size: 14px; font-weight: 600; color: #374151;">Reason for deletion:</p>
                      <p style="margin: 8px 0 0 0; color: #4b5563;">${reason}</p>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">
                      If you believe this was a mistake, please reach out to support.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 14px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} Your App. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return mailString;
}

export function formSubmittedCreatorMail(name: string, formTitle: string) {
  const mailString = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Form Response</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: 0 auto; border: 1px solid #f3f4f6;">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="background: #f0fdf4; width: 64px; height: 64px; border-radius: 50%; margin: 0 auto; padding: 12px; box-sizing: border-box; margin-bottom: 24px;">
                      <span style="font-size: 32px; line-height: 1;">📝</span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">New Response Received!</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 0 40px 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    <p style="margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
                    <p style="margin-bottom: 20px;">
                      Great news! You just received a new response on your form <strong>"${formTitle}"</strong>.
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">
                      Log in to your dashboard to view the full details of this submission and all other responses.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 14px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} Your App. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return mailString;
}

export function formSubmittedResponderMail(formTitle: string) {
  const mailString = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Submission Successful</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: 0 auto; border: 1px solid #f3f4f6;">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="background: #eff6ff; width: 64px; height: 64px; border-radius: 50%; margin: 0 auto; padding: 12px; box-sizing: border-box; margin-bottom: 24px;">
                      <span style="font-size: 32px; line-height: 1;">✨</span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">Thank you!</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 0 40px 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    <p style="margin-bottom: 20px;">Hello,</p>
                    <p style="margin-bottom: 20px;">
                      We've successfully received your submission for <strong>"${formTitle}"</strong>.
                    </p>
                    <p style="font-size: 15px; color: #4b5563; margin-bottom: 16px;">
                      Thank you for taking the time to fill this out! The creator of the form has been notified.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 14px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} Your App. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return mailString;
}
