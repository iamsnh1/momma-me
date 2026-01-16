const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Enable standalone output for Docker deployments
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  // Webpack configuration for path aliases
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    const projectRoot = path.resolve(__dirname)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': projectRoot,
    }
    config.resolve.modules = [
      path.resolve(projectRoot, 'node_modules'),
      ...(config.resolve.modules || []),
      projectRoot,
    ]
    
    // Ensure lib/db.ts is only bundled server-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    
    return config
  },
  // Headers for production deployment
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production'
    if (!isProduction) return []
    
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

module.exports = nextConfig

