import SideNavigation from "@/components/SideNavigation";
import EditProductForm from "./components/editProductForm";

const editProductPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNavigation />
      <div className="flex-1 p-6">
        <EditProductForm />
      </div>
    </div>
  );
};

export default editProductPage;
