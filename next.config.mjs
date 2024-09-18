/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_NEYNAR_CLIENT_ID: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID,
  },
};

export default nextConfig;
