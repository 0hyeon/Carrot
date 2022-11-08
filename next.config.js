/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "imagedelivery.net",
      "videodelivery.net",
      "customer-0m8lbpzbpnpgku81.cloudflarestream.com",
    ],
  },
};

module.exports = nextConfig;
