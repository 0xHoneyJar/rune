/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for deployment
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Base path if deploying to subdirectory
  // basePath: '/sigil',

  // Strict mode for better development experience
  reactStrictMode: true,
}

module.exports = nextConfig
