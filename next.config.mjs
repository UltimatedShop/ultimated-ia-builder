/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 🚨 Important : on dit à Next de NE PAS bloquer le build sur les erreurs TS
    ignoreBuildErrors: true
  }
};

export default nextConfig;
