import React from "react";
import ManageUsers from "./components/ManageUsers";

const AdminPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl text-center font-semibold mb-4">Admin panel</h1>
      <h2 className="text-xl text-center font-semibold mb-4">User manager:</h2>
      <ManageUsers />
    </div>
  );
};

export default AdminPage;
