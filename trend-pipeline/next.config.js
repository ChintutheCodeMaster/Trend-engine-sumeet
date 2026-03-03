/** @type {import('next').NextConfig} */
const nextConfig = {
  // These packages use Node.js built-ins and must run only on the server.
  serverExternalPackages: ['google-trends-api', '@anthropic-ai/sdk', 'stripe'],
};

module.exports = nextConfig;
