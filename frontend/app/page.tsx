import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/authOptions";
import ProductsList from "@/components/ProductsList";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center pt-4 min-h-screen bg-gray-100">
      <p className="text-gray-800 mb-1">Filter:</p>
      <ProductsList limit={10} />
      <a
        href="/products"
        className="view-all-products bg-white shadow-md rounded-lg p-4 flex items-center justify-center"
      >
        View all products
      </a>
    </div>
  );
}
