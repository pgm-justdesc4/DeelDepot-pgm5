import React from "react";
import SideNavigation from "@/components/SideNavigation";
import NewProductForm from "./components/newProductForm";

const addProductPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <SideNavigation />
      <div className="p-6">
        <h2 className="text-2xl text-center mb-4 font-semibold">
          Add new product
        </h2>
        <NewProductForm />
      </div>
    </div>
  );
};

export default addProductPage;
