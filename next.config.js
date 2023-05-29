/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
    reactStrictMode: true,
    webpack: (config, _options) => {
        config.module.rules.push({
            test: /\.wasm$/,
            use: ['url-loader']
        });

        return config;
    }
};

module.exports = withBundleAnalyzer(nextConfig);
