export type EmailLog = {
  id: string;
  order_id: string;
  to: string;
  subject: string;
  content: string;
  created_at: string;
};

export type CreateEmailLogInput = Omit<EmailLog, 'id' | 'created_at'>;

export type EmailLogState = {
  errors?: {
    order_id?: string[];
    to?: string[];
    subject?: string[];
    content?: string[];
  };
  message?: string | null;
};
