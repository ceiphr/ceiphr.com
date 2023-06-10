/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/**'
            }
        ]
    },
    webpack: (config, _options) => {
        config.module.rules.push(
            {
                // Load Rive's WASM binary
                test: /rive\.wasm/,
                use: ['url-loader']
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack']
            }
        );

        return config;
    },
    redirects: async () => {
        return [
            {
                source: '/a-crash-course-in-django',
                destination: '/blog/a-crash-course-in-django',
                permanent: true
            },
            {
                source: '/beveled-corners-with-sass',
                destination: '/blog/beveled-corners-with-sass',
                permanent: true
            },
            {
                source: '/sitemap',
                destination: '/sitemap.xml',
                permanent: true
            },
            {
                source: '/robots',
                destination: '/robots.txt',
                permanent: true
            },
            {
                source: '/rss',
                destination: '/rss.xml',
                permanent: true
            },
            {
                source: '/feed',
                destination: '/rss.xml',
                permanent: true
            },
            {
                source: '/feed.xml',
                destination: '/rss.xml',
                permanent: true
            },
            {
                source: '/atom',
                destination: '/atom.xml',
                permanent: true
            },
            {
                source: '/security.txt',
                destination: '/.well-known/security.txt',
                permanent: true
            }
        ];
    }
};

module.exports = withBundleAnalyzer(nextConfig);
