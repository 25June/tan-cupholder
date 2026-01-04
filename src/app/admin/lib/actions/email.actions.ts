'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';
import {
  SMTPConfig,
  EmailData,
  EmailResult,
  EmailTemplate
} from '@/models/email';
import {
  EMAIL_TEMPLATES,
  getLayoutTemplate
} from '@/constants/email-template.const';

// Email template schemas
const EmailTemplateSchema = z.object({
  to: z.string().email({ message: 'Invalid email address' })
});

/**
 * Get SMTP configuration from environment variables
 * @returns SMTPConfig object
 */
export const getSMTPConfig = async (): Promise<SMTPConfig> => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '465');
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP configuration incomplete. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.'
    );
  }

  return Promise.resolve({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });
};

/**
 * Send email using SMTP
 * @param emailAddress - Recipient email address
 * @param template - Email template to use
 * @param data - Data to populate the template
 * @returns Promise<EmailResult> - Result of the email sending operation
 */
export const sendEmail = async (
  emailAddress: string,
  templateName: EmailTemplate,
  data: EmailData
): Promise<EmailResult> => {
  console.log({ data });
  // Validate input parameters
  const validatedFields = EmailTemplateSchema.safeParse({
    to: emailAddress
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: `Validation error: ${
        validatedFields.error.errors[0]?.message || 'Invalid input'
      }`
    };
  }

  const { to } = validatedFields.data;

  try {
    console.log('start sending email');
    // Create transporter
    const config = await getSMTPConfig();

    const transporter = nodemailer.createTransport(config);
    console.log('transporter created');
    const template =
      EMAIL_TEMPLATES[templateName as keyof typeof EMAIL_TEMPLATES];
    if (!template) {
      return {
        success: false,
        message: `Template '${template}' not found`
      };
    }
    console.log('template found');
    // Send email
    const info = await transporter.sendMail({
      from: config.auth.user,
      to: to,
      subject: template.subject(data),
      html: template.html(data)
    });
    console.log('email sent');
    return {
      success: true,
      emailId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('SMTP email sending error:', error);
    return {
      success: false,
      emailId: '',
      message: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

export type SendCustomEmailState = {
  errors?: {
    to?: string[];
    subject?: string[];
    htmlContent?: string[];
  };
  message?: string | null;
};

const SendEmailSchema = z.object({
  to: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  htmlContent: z.string().min(1, { message: 'HTML content is required' })
});

export async function sendCustomEmail(formData: FormData) {
  const startTime = Date.now();
  const requestId = `email_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  console.log(`[${requestId}] 📧 Starting custom email send`, {
    to: formData.get('to'),
    subject: formData.get('subject'),
    contentLength: (formData.get('htmlContent') as string)?.length || 0
  });

  try {
    // Validate form data
    const validationResult = SendEmailSchema.safeParse({
      to: formData.get('to'),
      subject: formData.get('subject'),
      htmlContent: formData.get('htmlContent')
    });

    if (!validationResult.success) {
      console.warn(`[${requestId}] ⚠️ Validation failed`, {
        errors: validationResult.error.flatten().fieldErrors
      });
      return { errors: validationResult.error.flatten().fieldErrors };
    }

    const { to, subject, htmlContent } = validationResult.data;

    console.log(`[${requestId}] 📧 Add layout template`);
    const wrappedHtmlContent = getLayoutTemplate(htmlContent);

    console.log(`[${requestId}] 🔧 Creating SMTP transporter...`);
    const smtpConfig = await getSMTPConfig();
    const transporter = nodemailer.createTransport(smtpConfig);

    console.log(`[${requestId}] 📤 Sending email...`, {
      from: smtpConfig.auth.user,
      to,
      subject
    });

    const info = await transporter.sendMail({
      from: smtpConfig.auth.user,
      to,
      subject,
      html: wrappedHtmlContent
    });

    const duration = Date.now() - startTime;
    console.log(`[${requestId}] ✅ Email sent successfully`, {
      messageId: info.messageId,
      duration: `${duration}ms`
    });

    return {
      message: 'Email sent successfully.',
      emailId: info.messageId
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Failed to send email`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`
    });
    return { message: 'Failed to send email.' };
  }
}
