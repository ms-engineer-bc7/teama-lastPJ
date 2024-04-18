/** @type {import('next').NextConfig} */

// Docker でのホットリロード設定
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // experimental: {
  //   appDir: true,
  // },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && dev) {
      config.watchOptions = {
        poll: 100, // 300ミリ秒ごとにポーリング(定期的にチェックする)
        aggregateTimeout: 200,
      };
    }

    // Fullcalendar の設定
    config.resolve.alias = {
      ...config.resolve.alias,
      "@fullcalendar/common": "@fullcalendar/common",
      "@fullcalendar/daygrid": "@fullcalendar/daygrid",
      "@fullcalendar/react": "@fullcalendar/react",
      "@fullcalendar/interaction": "@fullcalendar/interaction",
    };

    return config;
  },
};

module.exports = nextConfig;
