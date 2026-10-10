/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  poweredByHeader: false,
  compress: true,
  async redirects() {
    // The old Digital-services page is now part of the GlofiHub Technology website.
    return [{ source: '/services', destination: '/technology/services', permanent: true }]
  },
}

export default nextConfig
