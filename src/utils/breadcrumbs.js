// Breadcrumb utilities for SEO
export const generateBreadcrumbSchema = (breadcrumbs) => {
  const baseUrl = "https://srilanka-explorer.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
};

// Common breadcrumb configurations
export const getBreadcrumbs = (page, params = {}) => {
  const breadcrumbs = [{ name: "Home", url: "/" }];

  switch (page) {
    case "provinces":
      breadcrumbs.push({ name: "Provinces", url: "/provinces" });
      break;

    case "districts":
      breadcrumbs.push({ name: "Provinces", url: "/provinces" });
      breadcrumbs.push({
        name: params.provinceName,
        url: `/province/${params.provinceId}`,
      });
      break;

    case "cities":
      breadcrumbs.push({ name: "Provinces", url: "/provinces" });
      breadcrumbs.push({
        name: params.provinceName,
        url: `/province/${params.provinceId}`,
      });
      breadcrumbs.push({
        name: params.districtName,
        url: `/province/${params.provinceId}/district/${params.districtId}`,
      });
      break;

    case "city-experiences":
      breadcrumbs.push({ name: "Provinces", url: "/provinces" });
      breadcrumbs.push({
        name: params.provinceName,
        url: `/province/${params.provinceId}`,
      });
      breadcrumbs.push({
        name: params.districtName,
        url: `/province/${params.provinceId}/district/${params.districtId}`,
      });
      breadcrumbs.push({
        name: params.cityName,
        url: `/province/${params.provinceId}/district/${
          params.districtId
        }/city/${encodeURIComponent(params.cityName)}`,
      });
      break;

    case "experiences":
      breadcrumbs.push({ name: "Experiences", url: "/experience" });
      break;

    default:
      break;
  }

  return breadcrumbs;
};
