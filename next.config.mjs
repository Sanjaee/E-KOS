/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      "res.cloudinary.com",
      "api.microlink.io",
      "lh3.googleusercontent.com",
    ],
  },
  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
