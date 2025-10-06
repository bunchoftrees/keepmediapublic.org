import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: '/Users/john/git/keepmediapublic.org',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint warnings.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
