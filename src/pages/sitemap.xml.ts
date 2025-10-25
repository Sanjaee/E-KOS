import { GetServerSideProps } from 'next'

const EXTERNAL_DATA_URL = 'https://zacode.vercel.app'

function generateSiteMap(pages: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}${page}`}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>daily</changefreq>
           <priority>0.8</priority>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps akan menangani
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const pages = [
    '/blog',
    '/chat',
    // Tambahkan halaman dinamis lainnya
  ]

  const sitemap = generateSiteMap(pages)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap