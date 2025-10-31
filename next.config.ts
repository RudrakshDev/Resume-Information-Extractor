/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows production builds even if there are type errors
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
