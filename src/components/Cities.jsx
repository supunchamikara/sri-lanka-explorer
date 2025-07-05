import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { sriLankaData } from "../data/sriLankaData";
import { SEOHelmet } from "../context/SEOContext";

const Cities = () => {
  const { provinceId, districtId } = useParams();
  const navigate = useNavigate();

  const province = sriLankaData.find((p) => p.id === parseInt(provinceId));
  const district = province?.districts.find(
    (d) => d.id === parseInt(districtId)
  );

  if (!province || !district) {
    return (
      <div className="min-h-screen bg-light-gray pt-20 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-blue mb-4">
            District Not Found
          </h1>
          <Link to="/" className="text-accent-gold hover:underline">
            Return to Provinces
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <SEOHelmet
        title={`${district.name} Cities - ${province.name} Travel Guide`}
        description={`Explore cities in ${district.name}, ${
          province.name
        }. Discover ${district.cities.join(
          ", "
        )} and their unique attractions. Complete travel guide for ${
          district.name
        } district.`}
        keywords={`${district.name}, ${district.cities.join(", ")}, ${
          province.name
        }, Sri Lanka cities, travel destinations, attractions`}
        canonicalUrl={`/province/${provinceId}/district/${districtId}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: `${district.name} Cities`,
          description: `Explore cities in ${district.name}, ${province.name}`,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: district.name,
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: province.name,
              containedInPlace: {
                "@type": "Country",
                name: "Sri Lanka",
              },
            },
          },
          hasPart: district.cities.map((city) => ({
            "@type": "City",
            name: city,
          })),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-accent-gold hover:text-navy-blue transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Provinces
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate(`/province/${provinceId}`)}
              className="text-accent-gold hover:text-navy-blue transition-colors"
            >
              {province.name}
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy-blue mb-2">
              {district.name}
            </h1>
            <p className="text-lg text-accent-gold mb-4">{province.name}</p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the {district.cities.length} major cities and towns in{" "}
              {district.name}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {district.cities.map((city, index) => (
            <Link
              key={index}
              to={`/province/${provinceId}/district/${districtId}/city/${encodeURIComponent(
                city
              )}`}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-accent-gold">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-navy-blue group-hover:text-accent-gold transition-colors">
                      {city}
                    </h3>
                    <div className="w-2 h-2 bg-accent-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <p className="text-gray-500 text-sm mt-2">
                    {district.name.replace(" District", "")}
                  </p>

                  <div className="flex items-center text-accent-gold group-hover:text-navy-blue transition-colors mt-3">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-xs">View Experiences</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-navy-blue mb-4">
            About {district.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">
                {district.cities.length}
              </div>
              <div className="text-gray-600">Major Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">
                {province.name.split(" ")[0]}
              </div>
              <div className="text-gray-600">Province</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">SL</div>
              <div className="text-gray-600">Sri Lanka</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
