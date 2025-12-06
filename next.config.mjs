/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ne bloque pas le build même s'il y a des erreurs TS
    ignoreBuildErrors: true
  },
  eslint: {
    // Ne bloque pas le build même s'il y a des erreurs ESLint
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
