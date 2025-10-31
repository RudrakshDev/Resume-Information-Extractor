// @ts-check
'use strict';

// Disable Turbopack and use webpack
process.env.TURBOPACK = '0';
process.env.TURBOPACK_BUILD = '0';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React StrictMode for static exports
  reactStrictMode: false,
  
  // Static export configuration
  output: 'export',
  trailingSlash: true,
  
  // Disable image optimization for static exports
  images: {
    unoptimized: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack configuration
  webpack: (config) => {
    // Handle static assets
    if (config.module?.rules) {
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash][ext]',
        },
      });
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL || '',
  },
};

module.exports = nextConfig;
