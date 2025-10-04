/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone mode for Docker
  output: "standalone",

  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "minio.kesimarket.com",
      "kesimarket.com",
      "assets.kesimarket.com",
      "catamphetamine.gitlab.io",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "minio.kesimarket.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kesimarket.com",
      },
      {
        protocol: "https",
        hostname: "assets.kesimarket.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "catamphetamine.gitlab.io",
        pathname: "/**",
      },
    ],
  },

  // Environment variables for client-side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

module.exports = nextConfig;
