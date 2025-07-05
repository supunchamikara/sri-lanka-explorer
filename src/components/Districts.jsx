import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { sriLankaData } from "../data/sriLankaData";
import { SEOHelmet } from "../context/SEOContext";

const Districts = () => {
  const { provinceId } = useParams();
  const navigate = useNavigate();

  const province = sriLankaData.find((p) => p.id === parseInt(provinceId));

  if (!province) {
    return (
      <div className="min-h-screen bg-light-gray pt-20 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-blue mb-4">
            Province Not Found
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
        title={`${province.name} Districts - Travel Guide Sri Lanka`}
        description={`Explore districts in ${
          province.name
        }. Discover cities, attractions, and travel experiences in ${province.districts
          .map((d) => d.name)
          .join(", ")}. Complete travel guide for ${province.name}.`}
        keywords={`${province.name}, ${province.districts
          .map((d) => d.name)
          .join(
            ", "
          )}, Sri Lanka districts, travel guide, destinations, cities`}
        canonicalUrl={`/province/${provinceId}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: `${province.name} Districts`,
          description: `Explore districts in ${province.name}`,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: province.name,
            containedInPlace: {
              "@type": "Country",
              name: "Sri Lanka",
            },
          },
          hasPart: province.districts.map((district) => ({
            "@type": "AdministrativeArea",
            name: district.name,
            identifier: district.id,
          })),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-accent-gold hover:text-navy-blue transition-colors mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Back to Provinces
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy-blue mb-4">
              {province.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the {province.districts.length} districts of{" "}
              {province.name}. Click on any district to discover its major
              cities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {province.districts.map((district) => (
            <Link
              key={district.id}
              to={`/province/${provinceId}/district/${district.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-accent-gold overflow-hidden">
                {/* District Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={district.image}
                    alt={district.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-district.jpg";
                    }}
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy-blue mb-3 group-hover:text-accent-gold transition-colors">
                    {district.name}
                  </h3>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-2">
                      {district.cities.length} Cities
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {district.cities.slice(0, 4).map((city, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-light-gray text-navy-blue text-xs rounded-full"
                      >
                        {city}
                      </span>
                    ))}
                    {district.cities.length > 4 && (
                      <span className="px-2 py-1 bg-accent-gold text-navy-blue text-xs rounded-full">
                        +{district.cities.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-accent-gold group-hover:text-navy-blue transition-colors">
                    <span className="text-sm font-medium">View Cities</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Districts;
