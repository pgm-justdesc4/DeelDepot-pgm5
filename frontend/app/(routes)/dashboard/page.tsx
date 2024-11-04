import SideNavigation from "../../../components/SideNavigation";
import UserProductsList from "./components/UserProductsList";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNavigation />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Your products:</h1>
        <UserProductsList />
      </div>
    </div>
  );
};

export default Dashboard;
