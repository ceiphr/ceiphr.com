/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: `https://${process.env.NEXT_PUBLIC_DOMAIN}`,
    generateRobotsTxt: true,
    changefreq: 'monthly',
    generateIndexSitemap: false,
    sitemapSize: 1000
};

module.exports = config;
