import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

// Create transporter
const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.port === 465,
    auth: config.mail.user ? {
        user: config.mail.user,
        pass: config.mail.pass,
    } : undefined,
});

interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

export class EmailService {
    /**
     * Send an email.
     */
    async send(options: SendMailOptions): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: config.mail.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });
            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    }

    /**
     * Send temporary password notification email.
     */
    async sendTempPasswordEmail(
        email: string,
        name: string,
        tempPassword: string,
        isReset: boolean = false
    ): Promise<boolean> {
        const subject = isReset
            ? 'Your password has been reset - Visakha Vidyalaya Events'
            : 'Welcome to Visakha Vidyalaya Events - Your Login Credentials';

        const greeting = isReset
            ? 'Your password has been reset by an administrator.'
            : 'An account has been created for you on the Visakha Vidyalaya Event Management System.';

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a5f, #2d5a87); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37; }
          .credentials p { margin: 10px 0; }
          .password { font-family: monospace; font-size: 18px; background: #f0f0f0; padding: 10px; border-radius: 4px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Visakha Vidyalaya</h1>
            <p>Event Management System</p>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>${greeting}</p>
            
            <div class="credentials">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong></p>
              <p class="password">${tempPassword}</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> You will be required to change this password upon your first login.
            </div>
            
            <p style="margin-top: 20px;">
              <a href="${config.app.url}/admin" style="background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Login Now</a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Visakha Vidyalaya Event Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;

        return this.send({ to: email, subject, html });
    }
}

export const emailService = new EmailService();
