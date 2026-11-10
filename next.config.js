/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  // Transpile Clerk packages so Next's bundler resolves CommonJS/ESM entry points correctly
  transpilePackages: [
    '@clerk/nextjs',
    '@clerk/backend',
    '@clerk/shared'
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|gif|ico|mp4)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Provide an (empty) Turbopack config to avoid the "webpack config with Turbopack" error.
  turbopack: {},

  // Webpack customizations: alias Clerk internal/shared paths to their dist outputs so
  // subpath imports like '@clerk/shared/browser' resolve to the package runtime files.
  webpack: (config, { webpack }) => {
    // Ensure config.resolve exists
    config.resolve = config.resolve || {};

    config.resolve.alias = Object.assign({}, config.resolve.alias || {}, {
      // Map the package root to the compiled runtime folder. This lets imports like
      // '@clerk/shared/browser' resolve to node_modules/@clerk/shared/dist/runtime/browser.js
      '@clerk/shared': path.resolve(__dirname, 'node_modules', '@clerk', 'shared', 'dist', 'runtime'),
      // Map backend to its dist so '@clerk/backend/internal' resolves correctly
      '@clerk/backend': path.resolve(__dirname, 'node_modules', '@clerk', 'backend', 'dist')
    });

    // Prefer .js when resolving package exports
    config.resolve.extensions = Array.from(new Set([...(config.resolve.extensions || []), '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx']));

    return config;
  }
};
