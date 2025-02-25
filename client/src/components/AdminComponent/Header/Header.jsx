import React from "react";

const Header = ({name}) => {
  return (
    <header className="bg-gray-800 shadow-md fixed top-0 left-0 right-0 md:ml-64 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            {name}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

