/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: require.resolve("stream-browserify"), // Maneja el módulo "node:stream"
    };
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false, // Permite omitir "node:" en los módulos
      },
    });
    return config;
  },
};

module.exports = nextConfig;
