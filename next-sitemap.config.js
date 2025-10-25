/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://zacode.vercel.app',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://zacode.vercel.app/sitemap.xml',
      ],
    },
    exclude: ['/admin/*', '/auth/*'],
    changefreq: 'daily',
    priority: 0.7,
  }