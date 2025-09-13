export interface EmailData {
  [key: string]: any;
}
export type EmailTemplate =
  | 'order-confirmation'
  | 'welcome'
  | 'password-reset'
  | 'custom';

export interface EmailResult {
  success: boolean;
  message: string;
  emailId?: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
