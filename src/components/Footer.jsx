import React from "react";

const Footer = () => {
  return (
    <footer className="bg-navy-blue text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-accent-gold text-lg font-semibold mb-4">
              Sri Lanka Explorer
            </h3>
            <p className="text-light-gray text-sm">
              Discover the beautiful provinces, districts, and cities of Sri
              Lanka. Your comprehensive guide to exploring the Pearl of the
              Indian Ocean.
            </p>
          </div>

          <div>
            <h4 className="text-accent-gold text-md font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-light-gray hover:text-accent-gold transition-colors"
                >
                  Provinces
                </a>
              </li>
              <li>
                <span className="text-light-gray">Districts</span>
              </li>
              <li>
                <span className="text-light-gray">Cities</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-accent-gold text-md font-semibold mb-4">
              About
            </h4>
            <p className="text-light-gray text-sm">
              This website provides comprehensive information about Sri Lanka's
              administrative divisions including all 9 provinces, their
              districts, and major cities.
            </p>
          </div>
        </div>

        <div className="border-t border-light-gray mt-8 pt-6 text-center">
          <p className="text-light-gray text-sm">
            © 2025 Sri Lanka Explorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
