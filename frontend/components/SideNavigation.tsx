"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 p-4 max-w-48 h-full min-h-screen">
      <ul className="space-y-2">
        <li>
          <Link
            href="/dashboard"
            className={`${
              pathname === "/dashboard" ? "bg-gray-700" : ""
            } text-white hover:bg-gray-700 px-3 py-2 rounded-md block`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className={`${
              pathname === "/settings" ? "bg-gray-700" : ""
            } text-white hover:bg-gray-700 px-3 py-2 rounded-md block`}
          >
            Account Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
