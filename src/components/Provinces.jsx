import React from "react";
import { Link } from "react-router-dom";
import { sriLankaData } from "../data/sriLankaData";
import { SEOHelmet } from "../context/SEOContext";

const Provinces = () => {
  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <SEOHelmet
        title="9 Provinces of Sri Lanka - Complete Travel Guide"
        description="Explore all 9 provinces of Sri Lanka including Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, and Sabaragamuwa. Discover districts, cities, and travel destinations."
        keywords="Sri Lanka provinces, 9 provinces Sri Lanka, Western Province, Central Province, Southern Province, Northern Province, Eastern Province, North Western Province, North Central Province, Uva Province, Sabaragamuwa Province"
        canonicalUrl="/provinces"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: "Provinces of Sri Lanka",
          description: "Explore the 9 beautiful provinces of Sri Lanka",
          containedInPlace: {
            "@type": "Country",
            name: "Sri Lanka",
          },
          hasPart: sriLankaData.map((province) => ({
            "@type": "AdministrativeArea",
            name: province.name,
            identifier: province.id,
          })),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-blue mb-4">
            Sri Lanka Provinces
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the 9 beautiful provinces of Sri Lanka. Click on any
            province to discover its districts and major cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sriLankaData.map((province) => (
            <Link
              key={province.id}
              to={`/province/${province.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-accent-gold overflow-hidden">
                {/* Province Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={province.image}
                    alt={province.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy-blue mb-3 group-hover:text-accent-gold transition-colors">
                    {province.name}
                  </h3>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-2">
                      {province.districts.length} Districts
                    </p>
                    <p className="text-gray-600 text-sm">
                      {province.districts.reduce(
                        (total, district) => total + district.cities.length,
                        0
                      )}{" "}
                      Cities
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {province.districts.slice(0, 3).map((district, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-light-gray text-navy-blue text-xs rounded-full"
                      >
                        {district.name.replace(" District", "")}
                      </span>
                    ))}
                    {province.districts.length > 3 && (
                      <span className="px-2 py-1 bg-accent-gold text-navy-blue text-xs rounded-full">
                        +{province.districts.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-accent-gold group-hover:text-navy-blue transition-colors">
                    <span className="text-sm font-medium">
                      Explore Districts
                    </span>
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

export default Provinces;
