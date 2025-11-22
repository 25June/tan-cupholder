'use server';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const getInvoiceSummary = async () => {
  try {
    const result = await sql`
      SELECT 
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_paid_amount,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as total_pending_amount
      FROM invoices
    `;

    const summary = result[0];

    return {
      paidCount: Number(summary.paid_count || 0),
      pendingCount: Number(summary.pending_count || 0),
      totalPaidAmount: Number(summary.total_paid_amount || 0),
      totalPendingAmount: Number(summary.total_pending_amount || 0)
    };
  } catch (error) {
    console.error('Failed to fetch invoice summary:', error);
    throw new Error('Failed to fetch invoice summary');
  }
};
