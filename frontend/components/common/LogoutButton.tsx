"use client";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton: React.FC = () => {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
