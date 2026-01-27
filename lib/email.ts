import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_EMAIL || 'noreply@birthtech.ai';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const emailStyles = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f4ff; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 40px 20px; text-align: center; }
  .logo { font-size: 28px; font-weight: bold; color: #ffffff; letter-spacing: -1px; }
  .logo-icon { display: inline-block; width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 12px; margin-right: 10px; vertical-align: middle; line-height: 40px; }
  .content { padding: 40px 30px; }
  .title { font-size: 24px; color: #1f2937; margin-bottom: 20px; font-weight: 600; }
  .text { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px; }
  .button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0; }
  .button:hover { opacity: 0.9; }
  .code-box { background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
  .code { font-size: 32px; font-weight: bold; color: #9333ea; letter-spacing: 4px; font-family: monospace; }
  .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer-text { font-size: 14px; color: #6b7280; margin: 5px 0; }
  .footer-links { margin-top: 15px; }
  .footer-links a { color: #9333ea; text-decoration: none; margin: 0 10px; font-size: 14px; }
  .highlight { background: linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%); border-radius: 12px; padding: 20px; margin: 20px 0; }
  .highlight-title { font-weight: 600; color: #9333ea; margin-bottom: 10px; }
  .divider { height: 1px; background: #e5e7eb; margin: 30px 0; }
`;

const getEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BirthTech</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-icon">&#x1F476;</span>
        BirthTech
      </div>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 14px;">AI-Powered Pregnancy & Baby Care</p>
    </div>
    ${content}
    <div class="footer">
      <p class="footer-text">This email was sent by BirthTech</p>
      <p class="footer-text">Your trusted AI companion for pregnancy and baby care</p>
      <div class="footer-links">
        <a href="${APP_URL}">Visit Website</a>
        <a href="${APP_URL}/privacy">Privacy Policy</a>
        <a href="${APP_URL}/terms">Terms of Service</a>
      </div>
      <p class="footer-text" style="margin-top: 20px; color: #9ca3af;">
        &copy; ${new Date().getFullYear()} BirthTech. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

export async function sendWelcomeEmail(email: string, name: string, verificationToken: string) {
  const verificationUrl = `${APP_URL}/auth/verify?token=${verificationToken}`;

  const content = `
    <div class="content">
      <h1 class="title">Welcome to BirthTech, ${name}! &#x1F389;</h1>
      <p class="text">
        Thank you for joining BirthTech! We're excited to be part of your pregnancy journey.
        Our AI-powered platform is here to support you with personalized meal plans, safe workout
        routines, and expert guidance every step of the way.
      </p>

      <p class="text">
        Please verify your email address to get started:
      </p>

      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify My Email</a>
      </div>

      <p class="text" style="font-size: 14px; color: #6b7280;">
        Or copy and paste this link in your browser:<br>
        <a href="${verificationUrl}" style="color: #9333ea; word-break: break-all;">${verificationUrl}</a>
      </p>

      <div class="divider"></div>

      <div class="highlight">
        <p class="highlight-title">&#x2728; What's waiting for you:</p>
        <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Personalized AI-generated meal plans</li>
          <li style="margin-bottom: 8px;">Safe pregnancy workout routines</li>
          <li style="margin-bottom: 8px;">Medical report analysis & tracking</li>
          <li style="margin-bottom: 8px;">Expert guidance throughout your journey</li>
        </ul>
      </div>

      <p class="text">
        If you didn't create an account with BirthTech, please ignore this email.
      </p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: `BirthTech <${FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to BirthTech - Verify Your Email',
      html: getEmailTemplate(content),
    });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;

  const content = `
    <div class="content">
      <h1 class="title">Reset Your Password &#x1F510;</h1>
      <p class="text">
        Hi ${name},
      </p>
      <p class="text">
        We received a request to reset your password. Click the button below to create a new password:
      </p>

      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset My Password</a>
      </div>

      <p class="text" style="font-size: 14px; color: #6b7280;">
        Or copy and paste this link in your browser:<br>
        <a href="${resetUrl}" style="color: #9333ea; word-break: break-all;">${resetUrl}</a>
      </p>

      <div class="highlight">
        <p class="highlight-title">&#x23F0; This link expires in 1 hour</p>
        <p style="color: #4b5563; margin: 0; font-size: 14px;">
          For security reasons, this password reset link will expire in 1 hour.
          If you need a new link, please request another password reset.
        </p>
      </div>

      <div class="divider"></div>

      <p class="text" style="font-size: 14px; color: #6b7280;">
        If you didn't request a password reset, please ignore this email or contact our support
        if you have concerns about your account security.
      </p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: `BirthTech <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset Your BirthTech Password',
      html: getEmailTemplate(content),
    });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPasswordChangedEmail(email: string, name: string) {
  const content = `
    <div class="content">
      <h1 class="title">Password Changed Successfully &#x2705;</h1>
      <p class="text">
        Hi ${name},
      </p>
      <p class="text">
        Your BirthTech password has been successfully changed. You can now use your new password to sign in to your account.
      </p>

      <div style="text-align: center;">
        <a href="${APP_URL}/auth/login" class="button">Sign In Now</a>
      </div>

      <div class="highlight">
        <p class="highlight-title">&#x26A0;&#xFE0F; Didn't make this change?</p>
        <p style="color: #4b5563; margin: 0; font-size: 14px;">
          If you didn't change your password, your account may have been compromised.
          Please <a href="${APP_URL}/auth/forgot-password" style="color: #9333ea;">reset your password immediately</a>
          and contact our support team.
        </p>
      </div>

      <div class="divider"></div>

      <p class="text" style="font-size: 14px;">
        Keep your account secure:
      </p>
      <ul style="color: #4b5563; font-size: 14px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Use a strong, unique password</li>
        <li style="margin-bottom: 8px;">Never share your password with anyone</li>
        <li style="margin-bottom: 8px;">Sign out when using shared devices</li>
      </ul>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: `BirthTech <${FROM_EMAIL}>`,
      to: email,
      subject: 'Your BirthTech Password Has Been Changed',
      html: getEmailTemplate(content),
    });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send password changed email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendVerificationCodeEmail(email: string, name: string, code: string) {
  const content = `
    <div class="content">
      <h1 class="title">Your Verification Code &#x1F511;</h1>
      <p class="text">
        Hi ${name},
      </p>
      <p class="text">
        Use the following verification code to complete your action:
      </p>

      <div class="code-box">
        <p class="code">${code}</p>
      </div>

      <p class="text" style="text-align: center; font-size: 14px; color: #6b7280;">
        This code expires in 10 minutes
      </p>

      <div class="divider"></div>

      <p class="text" style="font-size: 14px; color: #6b7280;">
        If you didn't request this code, please ignore this email.
      </p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: `BirthTech <${FROM_EMAIL}>`,
      to: email,
      subject: 'Your BirthTech Verification Code',
      html: getEmailTemplate(content),
    });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send verification code email:', error);
    return { success: false, error: error.message };
  }
}
