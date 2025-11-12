import type {NextConfig} from 'next';
      
const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    allowedDevOrigins: [
      '9003-firebase-studio-1762941953877.cluster-gjstlrnqpna56vr4xhdezmmq4e.cloudworkstations.dev',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

module.exports = nextConfig;
