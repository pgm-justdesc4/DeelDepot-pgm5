import React from "react";
import ManageUsers from "./components/ManageUsers";

const AdminPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin - Manage Users</h1>
      <ManageUsers />
    </div>
  );
};

export default AdminPage;
