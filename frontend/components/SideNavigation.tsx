"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-800 p-4 w-full">
      <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-center">
        <li>
          <Link
            href="/"
            className={`${
              pathname === "/" ? "bg-blue-700" : ""
            } text-white hover:bg-blue-700 px-3 py-2 rounded-md block`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard"
            className={`${
              pathname === "/dashboard" ? "bg-blue-700" : ""
            } text-white hover:bg-blue-700 px-3 py-2 rounded-md block`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className={`${
              pathname === "/settings" ? "bg-blue-700" : ""
            } text-white hover:bg-blue-700 px-3 py-2 rounded-md block`}
          >
            Account Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
