/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['./prisma/**/*']
    }
  }
};

module.exports = nextConfig;