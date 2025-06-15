/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: false, // Se estiver em desenvolvimento pode ajustar para true, mas o correto para produção é false
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
