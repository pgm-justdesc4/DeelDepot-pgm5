"use client";
import { signIn } from "next-auth/react";
import React from "react";

const LoginButton: React.FC = () => {
  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Login
    </button>
  );
};

export default LoginButton;
