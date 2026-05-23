/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: { typedRoutes: false },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://backend:5000"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
