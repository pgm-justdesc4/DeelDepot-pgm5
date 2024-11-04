import SideNavigation from "@/components/SideNavigation";
import NewProductForm from "./components/newProductForm";

const addProductPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNavigation />
      <div className="flex-1 p-6">
        <NewProductForm />
      </div>
    </div>
  );
};

export default addProductPage;
