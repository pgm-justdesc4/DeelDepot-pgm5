"use client";
import React from "react";
import ProductsList from "@/components/ProductsList";
import FilterProducts from "@/components/FilterProducts";
import SearchProducts from "@/components/SearchProducts";

const ProductsPage: React.FC = () => {
  const [filter, setFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="pt-4 min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-7">
          Products
        </h1>
        <hr className="mb-4" />
        <div className="flex justify-between">
          <SearchProducts
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div>
            <p className="text-gray-800 text-center mb-1">Filter:</p>
            <FilterProducts filter={filter} setFilter={setFilter} />
          </div>
        </div>
        <ProductsList limit={10} filter={filter} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default ProductsPage;
