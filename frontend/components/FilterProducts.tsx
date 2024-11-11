interface FilterProductsProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const FilterProducts: React.FC<FilterProductsProps> = ({
  filter,
  setFilter,
}) => {
  return (
    <div className="filter-buttons flex justify-center mb-4">
      <button
        className={`mr-2 py-2 px-4 rounded ${
          filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => setFilter("all")}
      >
        All
      </button>
      <button
        className={`py-2 px-4 rounded ${
          filter === "available" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => setFilter("available")}
      >
        Available
      </button>
    </div>
  );
};

export default FilterProducts;
