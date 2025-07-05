import { sriLankaData } from "../data/sriLankaData";

export const generateSitemap = () => {
  const baseUrl = "https://srilanka-explorer.com";
  const now = new Date().toISOString();

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Home page
  sitemap += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Provinces page
  sitemap += `  <url>
    <loc>${baseUrl}/provinces</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Individual provinces
  sriLankaData.forEach((province) => {
    sitemap += `  <url>
    <loc>${baseUrl}/province/${province.id}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

    // Districts within each province
    province.districts.forEach((district) => {
      sitemap += `  <url>
    <loc>${baseUrl}/province/${province.id}/district/${district.id}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;

      // Cities within each district
      district.cities.forEach((city) => {
        sitemap += `  <url>
    <loc>${baseUrl}/province/${province.id}/district/${
          district.id
        }/city/${encodeURIComponent(city)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      });
    });
  });

  // Experience page
  sitemap += `  <url>
    <loc>${baseUrl}/experience</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;

  // Auth page
  sitemap += `  <url>
    <loc>${baseUrl}/auth</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
`;

  sitemap += `</urlset>`;

  return sitemap;
};

export const generateRobotsTxt = () => {
  const baseUrl = "https://srilanka-explorer.com";

  return `User-agent: *
Allow: /
Disallow: /auth
Disallow: /add-experience
Disallow: /edit-experience
Disallow: /profile

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;
};
