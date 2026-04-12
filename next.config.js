/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003',
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '1492693587614371971',
  },
}

module.exports = nextConfig