import React from "react";

interface SearchProductsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchProducts: React.FC<SearchProductsProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="search-bar flex justify-center mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className=" px-4 rounded border border-gray-300"
      />
      <button className=" px-4 rounded-r bg-blue-500 text-white hover:bg-blue-700">
        Search
      </button>
    </div>
  );
};

export default SearchProducts;
