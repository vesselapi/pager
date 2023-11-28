// Importing env files here to validate on build
import '@vessel/api/env.mjs';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ['@vessel/api', '@vessel/db'],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },
};

export default config;
