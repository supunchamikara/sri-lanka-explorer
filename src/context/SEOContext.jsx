import React, { createContext, useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SEOContext = createContext();

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error("useSEO must be used within a SEOProvider");
  }
  return context;
};

export const SEOProvider = ({ children }) => {
  const updateSEO = ({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType = "website",
    structuredData,
    noindex = false,
  }) => {
    const siteTitle = "Sri Lanka Explorer";
    const fullTitle = title
      ? `${title} | ${siteTitle}`
      : `${siteTitle} - Discover Amazing Travel Experiences`;
    const baseUrl = "https://srilanka-explorer.com";

    return {
      title: fullTitle,
      description:
        description ||
        "Explore Sri Lanka's hidden gems, authentic experiences, and breathtaking destinations. Share your travel stories and discover the best places to visit in Sri Lanka.",
      keywords:
        keywords ||
        "Sri Lanka travel, tourism, destinations, experiences, provinces, districts, cities, travel guide, Ceylon, adventure, culture, beaches, mountains, temples",
      canonicalUrl: canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl,
      ogImage: ogImage || `${baseUrl}/og-image.jpg`,
      ogType,
      structuredData,
      noindex,
    };
  };

  return (
    <SEOContext.Provider value={{ updateSEO }}>
      <HelmetProvider>{children}</HelmetProvider>
    </SEOContext.Provider>
  );
};

export const SEOHelmet = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = "website",
  structuredData,
  noindex = false,
}) => {
  const { updateSEO } = useSEO();
  const seoData = updateSEO({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType,
    structuredData,
    noindex,
  });

  return (
    <Helmet>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <link rel="canonical" href={seoData.canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:type" content={seoData.ogType} />
      <meta property="og:image" content={seoData.ogImage} />

      {/* Twitter */}
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:url" content={seoData.canonicalUrl} />
      <meta name="twitter:image" content={seoData.ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
