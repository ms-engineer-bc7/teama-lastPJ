/** @type {import('next').NextConfig} */

// Docker環境でのホットリロード設定
const nextConfig = {
  reactStrictMode: true,
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 300, // 300ミリ秒ごとにポーリング
      aggregateTimeout: 200,
    };
    return config;
  },
};

module.exports = nextConfig;
