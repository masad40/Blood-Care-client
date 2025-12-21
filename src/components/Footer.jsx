import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-neutral text-neutral-content">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h3 className="text-xl font-bold mb-2">🩸 BloodCare</h3>
          <p>Saving lives through blood donation.</p>
          <p className="text-sm mt-2">
            © {new Date().getFullYear()} BloodCare. All rights reserved.
          </p>
        </div>
      </footer>
    );
};

export default Footer;