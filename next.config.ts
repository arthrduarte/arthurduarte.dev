import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/list-of-lists",
        destination: "/archive",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
