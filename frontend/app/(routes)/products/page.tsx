import ProductsOverview from "@/components/ProductsList";

export default function productsPage() {
  return (
    <div className="flex flex-col items-center pt-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800">Products</h1>
      <p className="text-lg text-gray-700 text-center max-w-md">
        filter all/available & categories
      </p>
      <ProductsOverview />
    </div>
  );
}
