import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/authOptions";
import ProductsOverview from "@/components/ProductsOverview";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center pt-4 min-h-screen bg-gray-100">
      <p className="text-lg text-gray-700 text-center max-w-md">
        filter all/available & categories
      </p>
      <ProductsOverview limit={10} />
      <a
        href="/products"
        className="view-all-products bg-white shadow-md rounded-lg p-4 flex items-center justify-center"
      >
        View All Products
      </a>
    </div>
  );
}
