/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: *.googleapis.com *.googletagmanager.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: https: *.unsplash.com *.pravatar.cc; font-src 'self' *.googleapis.com *.gstatic.com; connect-src 'self' *.supabase.co *.supabase.com fonts.googleapis.com *.gstatic.com overbridgenet.com; frame-src 'self';",
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.resolve(__dirname),
  trailingSlash: false,
  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'lucide-react'],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://limitlessinfotech.com',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'limitlessinfotech.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
  },
  compress: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: *.googleapis.com *.googletagmanager.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: https: *.unsplash.com *.pravatar.cc *.cdn.unsplash.com; font-src 'self' *.googleapis.com *.gstatic.com; connect-src 'self' *.supabase.co *.supabase.com *.google-analytics.com fonts.googleapis.com *.gstatic.com overbridgenet.com; frame-src 'self';",
          },
        ],
      },
    ]
  },
}

export default nextConfig
