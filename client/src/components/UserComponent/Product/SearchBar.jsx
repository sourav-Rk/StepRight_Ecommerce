import { Search, X } from "lucide-react";

const SearchBar = ({ searchTerm, handleSearchChange }) => {
  const handleClearSearch = () => {
    handleSearchChange({ target: { value: "" } }); // Clear search term
  };

  return (
    <div className="mb-6 flex justify-end">
      <div className="relative flex items-center w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        <button
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
            searchTerm
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!searchTerm}
          onClick={handleClearSearch}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SearchBar;