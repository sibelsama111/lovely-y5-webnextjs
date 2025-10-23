/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'lovely5.techserv@gmail.com'
  }
}

module.exports = nextConfig