"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginButton from "./common/LoginButton";
import LogoutButton from "./common/LogoutButton";

const Navigation: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800">
      <div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="text-white text-3xl font-bold">
          DeelDepot
        </Link>
        <div className="flex items-center justify-center space-x-4">
          {session ? (
            <>
              {session.user?.role === "Admin" && (
                <Link href="/admin" className="text-white">
                  Admin Panel
                </Link>
              )}
              <Link href="/dashboard" className="text-white">
                Dashboard
              </Link>
              <Link href={"/chat"} className="text-white">
                Inbox
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
      </div>
    </nav>
  );
};

export default Navigation;
