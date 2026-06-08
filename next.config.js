/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  images: {
    // Modern formats first; Next serves AVIF/WebP when the browser supports it.
    formats: ['image/avif', 'image/webp'],
    // Whitelist only the hosts that actually serve generated/product images.
    // MinIO bucket and Supabase storage — see .env.local.
    remotePatterns: [
      { protocol: 'https', hostname: 'minio.wilkiedevs.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
