import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

/** Бүх хариунд: clickjacking, MIME таамаглал, referrer алдагдлаас хамгаална. */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Railway HTTPS-ээр үйлчилнэ; локал http-д HSTS тавихгүй.
  ...(isProduction
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Ажлын өмнөх/дараах хос зураг: 2 × 8 MB + маягтын илүүдэл
    serverActions: { bodySizeLimit: '17mb' },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
