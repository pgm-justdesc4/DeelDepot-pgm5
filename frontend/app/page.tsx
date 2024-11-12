import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/authOptions";
import ProductsList from "@/components/ProductsList";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div className="bg-white shadow-lg p-8 pt-14 pb-14">
        <h1 className="text-5xl font-extrabold text-center text-blue-600 pt-8">
          Welcome to DeelDepot!
        </h1>
        <p className="text-center mt-7 text-gray-600 text-lg">
          We are a peer-to-peer platform for the people, by the people. Share
          your items with your community.
        </p>
      </div>
      <hr className="my-8 border-gray-300" />
      <div className="flex flex-col items-center pt-4 pb-7 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-600">
          Available products:
        </h2>
        <ProductsList limit={8} filter="available" searchQuery="" />
        <a
          href="/products"
          className="view-all-products bg-blue-500 text-white shadow-lg rounded-lg p-4 mt-6 flex items-center justify-center hover:bg-blue-700 transition duration-300"
        >
          View all &rarr;
        </a>
      </div>
    </div>
  );
}
