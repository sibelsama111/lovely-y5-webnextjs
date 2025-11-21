/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remover output: 'export' para poder usar API routes
  trailingSlash: true,
  webpack: (config, { dev, isServer }) => {
    // Eliminar la advertencia de depreciación
    config.infrastructureLogging = {
      level: 'error',
    }
    
    return config
  },
  // Security headers
  poweredByHeader: false,
  // Production settings
  typescript: {
    // Ensure type checking in production
    ignoreBuildErrors: process.env.NODE_ENV === 'development'
  },
  eslint: {
    // Ensure linting in production
    ignoreDuringBuilds: process.env.NODE_ENV === 'development'
  },
  // Image optimization
  images: {
    domains: ['localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Environment variables que deben estar disponibles en el cliente
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'lovely5.techserv@gmail.com',
    // Firebase config
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  }
}

module.exports = nextConfig