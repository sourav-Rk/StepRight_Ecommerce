import React from 'react';
import { Instagram } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Policy", href: "/shipping" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refunds & Cancellations", href: "/refunds" }
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 py-8">
      {/* Navigation Links */}
      <div className="max-w-6xl mx-auto px-4">
        <h3 className='text-xl text-center'>StepRight</h3>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 mt-12">
          {footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Social Media */}
        <div className="flex justify-center mb-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-white transition-colors duration-200"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-2">
            © 2025, 
            <a 
              href="/"
              className="hover:text-white transition-colors duration-200"
            >
              StepRight
            </a>
            <span className="px-2">Powered by StepRight</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;