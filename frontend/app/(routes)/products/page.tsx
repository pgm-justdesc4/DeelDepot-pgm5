import ProductsOverview from "@/components/ProductsList";

export default function productsPage() {
  return (
    <div className="flex flex-col items-center pt-4 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-semibold text-gray-800 mb-7">Products</h1>
      <p className="text-gray-800 mb-1">Filter:</p>
      <ProductsOverview />
    </div>
  );
}
