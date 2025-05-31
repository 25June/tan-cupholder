import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Define the default locale
  defaultLocale: 'en',
  // Define the supported locales
  locales: ['en', 'vi'],
});
