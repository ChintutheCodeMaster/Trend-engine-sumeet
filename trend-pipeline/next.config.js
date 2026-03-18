/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // These packages use Node.js built-ins and must run only on the server.
    serverComponentsExternalPackages: ['google-trends-api', '@anthropic-ai/sdk', 'stripe'],
  },
};

module.exports = nextConfig;
