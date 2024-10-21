"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginButton from "./common/LoginButton";
import LogoutButton from "./common/LogoutButton";

const Navigation: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-3xl font-bold">
        DeelDepot
      </Link>
      <div className="flex items-center justify-center space-x-4">
        {session ? (
          <>
            <Link href="/dashboard" className="text-white">
              Dashboard
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/register" className="text-white">
              Register
            </Link>
            <LoginButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
