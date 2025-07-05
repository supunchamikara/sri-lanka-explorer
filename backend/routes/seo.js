const express = require("express");
const router = express.Router();

// Sri Lanka data for sitemap generation
const sriLankaData = [
  {
    id: 1,
    name: "Western Province",
    districts: [
      {
        id: 11,
        name: "Colombo District",
        cities: [
          "Colombo",
          "Dehiwala-Mount Lavinia",
          "Moratuwa",
          "Sri Jayawardenepura Kotte",
          "Battaramulla",
          "Maharagama",
          "Kotte",
          "Nugegoda",
          "Homagama",
          "Kaduwela",
        ],
      },
      {
        id: 12,
        name: "Gampaha District",
        cities: [
          "Gampaha",
          "Negombo",
          "Katunayake",
          "Kelaniya",
          "Wattala",
          "Minuwangoda",
          "Ja-Ela",
          "Kandana",
          "Divulapitiya",
          "Nittambuwa",
        ],
      },
      {
        id: 13,
        name: "Kalutara District",
        cities: [
          "Kalutara",
          "Panadura",
          "Horana",
          "Beruwala",
          "Aluthgama",
          "Matugama",
          "Wadduwa",
          "Bandaragama",
          "Ingiriya",
          "Bulathsinhala",
        ],
      },
    ],
  },
  // Add other provinces here (abbreviated for example)
  {
    id: 2,
    name: "Central Province",
    districts: [
      {
        id: 21,
        name: "Kandy District",
        cities: ["Kandy", "Peradeniya", "Gampola", "Katugastota", "Kundasale"],
      },
      {
        id: 22,
        name: "Matale District",
        cities: ["Matale", "Dambulla", "Rattota", "Galewela"],
      },
      {
        id: 23,
        name: "Nuwara Eliya District",
        cities: ["Nuwara Eliya", "Hatton", "Talawakele", "Bandarawela"],
      },
    ],
  },
];

// GET /api/sitemap.xml - Generate XML sitemap
router.get("/sitemap.xml", (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "https://srilanka-explorer.com";
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

    sitemap += `</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate sitemap",
    });
  }
});

// GET /api/robots.txt - Generate robots.txt
router.get("/robots.txt", (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "https://srilanka-explorer.com";

    const robotsTxt = `User-agent: *
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

    res.set("Content-Type", "text/plain");
    res.send(robotsTxt);
  } catch (error) {
    console.error("Robots.txt generation error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate robots.txt",
    });
  }
});

module.exports = router;
