import SideNavigation from "../../../components/SideNavigation";
import UserProductsList from "./components/UserProductsList";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <SideNavigation />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center">
          <Link
            href="/products/new"
            className="p-2 px-4 py-2 max-w-48 w-full text-center bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            New product
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mt-4">Your products:</h1>
        <UserProductsList />
      </div>
    </div>
  );
};

export default Dashboard;
