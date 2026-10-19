import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Ажлын өмнөх/дараах хос зураг: 2 × 8 MB + маягтын илүүдэл
    serverActions: { bodySizeLimit: '17mb' },
  },
};

export default nextConfig;
