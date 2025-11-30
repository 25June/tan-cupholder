import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-485637738840450490e408cee2acb72c.r2.dev',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'pixboost.com',
        port: '',
        pathname: '/api/2/img/**'
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
