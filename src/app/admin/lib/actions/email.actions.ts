'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';
import {
  SMTPConfig,
  EmailData,
  EmailResult,
  EmailTemplate
} from '@/models/email';
import { EMAIL_TEMPLATES } from '@/constants/email-template.const';

// Email template schemas
const EmailTemplateSchema = z.object({
  to: z.string().email({ message: 'Invalid email address' })
});

/**
 * Get SMTP configuration from environment variables
 * @returns SMTPConfig object
 */
const getSMTPConfig = (): SMTPConfig => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP configuration incomplete. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.'
    );
  }

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  };
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
  template: EmailTemplate,
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
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });
    console.log('transporter created');
    const template = EMAIL_TEMPLATES['order-confirmation'];
    if (!template) {
      return {
        success: false,
        message: `Template '${template}' not found`
      };
    }
    console.log('template found');
    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: to,
      subject: template.subject(data.orderId),
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
