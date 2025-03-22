import React from 'react';
import { Instagram, HelpCircle, CreditCard } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Policy", href: "/shipping" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refunds & Cancellations", href: "/refunds" },
    { name: "FAQ", href: "/faq" }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Top Section with Logo and Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <img 
                src="/StepRightLogo.png" 
                alt="StepRight Logo" 
                className="h-10"
              />
              <h3 className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                StepRight
              </h3>
            </div>
            <p className="text-gray-400 text-sm mt-2 text-center md:text-left">
              Walk with confidence, step with style.
            </p>
            
            {/* Social Media */}
            <div className="mt-6 flex space-x-4">
              <a 
                href={`https://www.instagram.com/.sourav._?utm_source=qr&igsh=MTc1em80bDZ2azZ5MQ==`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="/faq" 
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <HelpCircle size={24} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center md:text-left">Quick Links</h4>
            <ul className="space-y-2 text-center md:text-left">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Payment Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center md:text-left">Payment Methods</h4>
            <div className="flex justify-center md:justify-start space-x-3 mt-4">
              <div className="bg-white p-2 rounded-md">
                <CreditCard size={24} className="text-black" />
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-md">
                <span className="font-bold text-white text-xs">VISA</span>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-2 rounded-md">
                <span className="font-bold text-white text-xs">RUPAY</span>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-700 p-2 rounded-md">
                <span className="font-bold text-white text-xs">AMEX</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center md:text-left">
              Secure payment processing for your peace of mind
            </p>
          </div>
        </div>
        
        {/* Bottom Section with Copyright */}
        <div className="pt-8 md:flex md:items-center md:justify-between text-center md:text-left">
          <div>
            <p className="text-sm text-gray-400">
              © 2025, <span className="font-medium text-white">StepRight</span>. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-gray-500">
              Powered by <span className="font-medium">StepRight</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;