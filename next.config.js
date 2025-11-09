/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "files.stripe.com" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;
