import { writeFileSync } from 'fs';

const baseUrl = 'https://arnost.kernelkicks.dev';

const staticPages = [
  '',
  '#about',
  '#skills',
  '#projects',
  '#content',
  '#education',
  '#languages',
  '#contact',
];

const allUrls = staticPages.map((path) => `${baseUrl}${path}`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === baseUrl ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated at public/sitemap.xml');