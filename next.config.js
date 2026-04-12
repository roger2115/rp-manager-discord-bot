/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    telemetry: false
  },
  output: 'standalone',
  distDir: '.next'
}

module.exports = nextConfig