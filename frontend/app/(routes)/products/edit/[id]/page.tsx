import React from "react";
import SideNavigation from "@/components/SideNavigation";
import EditProductForm from "./components/editProductForm";

const editProductPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <SideNavigation />
      <div className="p-6">
        <h2 className="text-2xl text-center mb-4 font-semibold">
          Edit product
        </h2>
        <EditProductForm />
      </div>
    </div>
  );
};

export default editProductPage;
