/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["images.unsplash.com", "replicate.delivery", "files.stripe.com"],
  },
};
module.exports = nextConfig;
