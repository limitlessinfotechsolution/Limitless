/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
  enabled: process.env.ANALYZE === 'true',
});

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
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: *.googleapis.com *.googletagmanager.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: https: *.unsplash.com *.pravatar.cc; font-src 'self' *.googleapis.com *.gstatic.com; connect-src 'self' ws://localhost:* http://localhost:* *.supabase.co *.supabase.com fonts.googleapis.com *.gstatic.com overbridgenet.com; frame-src 'self';",
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

  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'framer-motion'],
    optimizeCss: true,
    scrollRestoration: true,
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
        hostname: 'ui-avatars.com',
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
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  compress: true,

  // Bundle optimization
  webpack: (config, { dev, isServer, webpack }) => {
    // Alias configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // Production optimizations
    if (!dev && !isServer) {
      // Enable webpack optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              chunks: 'all',
              priority: 20,
            },
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              chunks: 'all',
              priority: 20,
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };

      // Add compression plugin for production
      if (!dev) {
        config.plugins.push(
          new webpack.optimize.ModuleConcatenationPlugin()
        );
      }
    }

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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: *.googleapis.com *.googletagmanager.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: https: *.unsplash.com *.pravatar.cc *.ui-avatars.com *.cdn.unsplash.com; font-src 'self' *.googleapis.com *.gstatic.com; connect-src 'self' ws://localhost:* http://localhost:* *.supabase.co *.supabase.com *.google-analytics.com fonts.googleapis.com *.gstatic.com overbridgenet.com; frame-src 'self';",
          },
          // Cache headers for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes caching
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
          },
        ],
      },
      // Static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
