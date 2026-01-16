'use client';

// import {
//   getCookie,
//   removeCookie,
//   setCookie
// } from '@/shared/utils/cookies.utils';
import { LocalStorageKey } from '@/constants/storageKey.const';

export const getStorage = (key: string) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting storage', error);
    return null;
  }
};

export const setStorage = (key: string, value: any) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting storage', error);
    return null;
  }
};

export const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing storage', error);
    return null;
  }
};

export const saveViewedProductToStorage = (productId: string) => {
  const viewedProducts = getViewedProductsFromStorage();

  viewedProducts[productId] = (viewedProducts[productId] || 0) + 1;
  setStorage(LocalStorageKey.VIEWED_PRODUCTS, viewedProducts);
};

export const getViewedProductsFromStorage = () => {
  const viewedProducts = getStorage(LocalStorageKey.VIEWED_PRODUCTS) || {};
  return viewedProducts;
};

export const saveProductToCart = (productId: string, quantity: number) => {
  const cart = getCartFromStorage();
  cart.push({ productId, quantity });
  setStorage(LocalStorageKey.CART, cart);
};

export const updateProductQuantityInCart = (
  productId: string,
  quantity: number
) => {
  const cart = getCartFromStorage();
  const index = cart.findIndex(
    (item: { productId: string }) => item.productId === productId
  );
  if (index !== -1) {
    cart[index].quantity = quantity;
    setStorage(LocalStorageKey.CART, cart);
  }
};

export const getCartFromStorage = () => {
  const cart = getStorage(LocalStorageKey.CART) || [];
  return cart;
};

export const getCartCountFromStorage = () => {
  const cart = getCartFromStorage();
  return cart.length;
};

export const clearCartFromStorage = (productIds: string[]) => {
  const cart = getCartFromStorage();
  const newCart = cart.filter(
    (item: { productId: string }) => !productIds.includes(item.productId)
  );
  setStorage(LocalStorageKey.CART, newCart);
};

export const getContentFromStorage = () => {
  const content = getStorage(LocalStorageKey.CONTENT) || null;
  return content;
};

export const setContentToStorage = (content: Record<string, string>) => {
  setStorage(LocalStorageKey.CONTENT, content);
};
