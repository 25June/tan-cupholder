export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailTemplateFormData {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  description?: string;
  isActive: boolean;
}

export interface EmailTemplateResponse {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  description?: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}
