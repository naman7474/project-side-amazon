/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
      },
    ];
  },
  experimental: {
    externalDir: {
      enabled: true,
      unsafeDirAlias: ["/api"],
    },
  },
  optimizeServerReact: true,
  async redirects() {
    return [
      {
        source: "/auth/login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
