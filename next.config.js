/** @type {import('next').NextConfig} */
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

module.exports = nextConfig;
