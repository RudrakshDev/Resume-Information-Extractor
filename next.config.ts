import type { NextConfig } from 'next';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  
  // Static export configuration
  output: 'export',
  trailingSlash: true,
  
  // Asset prefix for static exports
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  
  // CSS and asset handling
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  
  // Webpack configuration for static assets
  webpack: (config, { isServer }) => {
    // Handle static assets
    config.module?.rules?.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });

    // Ensure CSS is properly extracted
    if (!isServer) {
      config.resolve.alias['@vercel/og'] = 'next/dist/experimental/og';
    }

    return config;
  },
  
  // Enable production source maps
  productionBrowserSourceMaps: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL || '',
  },
  
  // Disable React StrictMode for static exports
  reactStrictMode: false,
};

export default nextConfig;
