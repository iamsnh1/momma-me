/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Enable standalone output for Docker deployments
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
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

