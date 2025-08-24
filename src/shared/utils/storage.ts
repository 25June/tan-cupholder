import { LocalStorageKey } from '@/constants/storageKey.const';

export const getStorage = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const setStorage = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = (key: string) => {
  localStorage.removeItem(key);
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

export const getCartFromStorage = () => {
  const cart = getStorage(LocalStorageKey.CART) || [];
  return cart;
};

export const getCartCountFromStorage = () => {
  const cart = getCartFromStorage();
  return cart.length;
};
