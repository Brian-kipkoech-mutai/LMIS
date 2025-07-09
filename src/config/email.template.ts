export const LoginVerificationTemplate = `<!DOCTYPE html>
<html lang="en" style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 0; margin: 0;">
  <head>
    <meta charset="UTF-8" />
    <title>Your Verification Code</title>
  </head>
  <body style="background-color: #f6f9fc; padding: 30px; color: #333;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);">
            <tr>
              <td style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #2d3748; font-size: 24px; margin-bottom: 10px;">🔐 Your Verification Code</h2>
                <p style="font-size: 16px; color: #4a5568; margin: 0 0 25px;">
                  Use the code below to verify your account. It will expire in 5 minutes.
                </p>
                <div style="display: inline-block; background-color: #edf2f7; padding: 15px 25px; font-size: 28px; font-weight: bold; color: #2b6cb0; letter-spacing: 4px; border-radius: 6px;">
                  {{OTP_CODE}}
                </div>
                <p style="font-size: 14px; color: #718096; margin-top: 30px;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f7fafc; padding: 20px; text-align: center; font-size: 13px; color: #a0aec0;">
                © {{YEAR}} Somalia Livestock Market Portal, All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
