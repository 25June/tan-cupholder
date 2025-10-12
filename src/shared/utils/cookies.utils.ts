'use client';

export const setCookie = (name: string, value: string, lifespan?: number) => {
  let expires = '';
  const date = new Date();
  const defaultLifespan = 60 * 60 * 1000; // 60 mins * 60 seconds * 1000 milliseconds = 1 hour
  date.setTime(date.getTime() + (lifespan || defaultLifespan)); // 60 mins * 60 seconds * 1000 milliseconds = 1 hour
  expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const getCookie = (name: string) => {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return value ? value.split('=')[1] : null;
};
