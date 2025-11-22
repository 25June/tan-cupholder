'use server';

import {
  fetchFilteredInvoices,
  fetchInvoicesPages,
  fetchInvoiceWithOrderById
} from './data';

// Server action to fetch filtered invoices
export const getFilteredInvoices = async (
  query: string,
  currentPage: number
) => {
  try {
    return await fetchFilteredInvoices(query, currentPage);
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    throw new Error('Failed to fetch invoices');
  }
};

// Server action to fetch invoice pages count
export const getInvoicesPages = async (query: string) => {
  try {
    return await fetchInvoicesPages(query);
  } catch (error) {
    console.error('Failed to fetch invoice pages:', error);
    throw new Error('Failed to fetch invoice pages');
  }
};

// Server action to fetch invoice with order details
export const getInvoiceWithOrder = async (id: string) => {
  try {
    return await fetchInvoiceWithOrderById(id);
  } catch (error) {
    console.error('Failed to fetch invoice details:', error);
    throw new Error('Failed to fetch invoice details');
  }
};
