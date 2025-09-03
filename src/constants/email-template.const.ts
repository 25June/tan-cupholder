import { EmailData } from '@/models/email';

export const EMAIL_TEMPLATES = {
  'order-confirmation': {
    subject: 'Order Confirmation - Tan Cup Holder',
    html: (data: EmailData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmation</h1>
        <p>Dear ${data.customerName || 'Customer'},</p>
        <p>Thank you for your order! Your order has been successfully placed.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${data.orderId || 'N/A'}</p>
          <p><strong>Total Amount:</strong> ${data.totalAmount || 'N/A'}</p>
          <p><strong>Order Date:</strong> ${
            data.orderDate || new Date().toLocaleDateString()
          }</p>
        </div>
        <p>We will process your order and ship it to you as soon as possible.</p>
        <p>Best regards,<br>Tan Cup Holder Team</p>
      </div>
    `
  },
  welcome: {
    subject: 'Welcome to Tan Cup Holder',
    html: (data: EmailData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Tan Cup Holder!</h1>
        <p>Dear ${data.customerName || 'Customer'},</p>
        <p>Welcome to our community! We're excited to have you on board.</p>
        <p>Here's what you can expect from us:</p>
        <ul>
          <li>High-quality cup holders</li>
          <li>Fast and reliable shipping</li>
          <li>Excellent customer support</li>
        </ul>
        <p>If you have any questions, feel free to reach out to us.</p>
        <p>Best regards,<br>Tan Cup Holder Team</p>
      </div>
    `
  },
  'password-reset': {
    subject: 'Password Reset Request - Tan Cup Holder',
    html: (data: EmailData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Dear ${data.customerName || 'Customer'},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink || '#'}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Tan Cup Holder Team</p>
      </div>
    `
  },
  custom: {
    subject: 'Message from Tan Cup Holder',
    html: (data: EmailData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${
          data.title || 'Message from Tan Cup Holder'
        }</h1>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${data.content || 'No content provided'}
        </div>
        <p>Best regards,<br>Tan Cup Holder Team</p>
      </div>
    `
  }
};
