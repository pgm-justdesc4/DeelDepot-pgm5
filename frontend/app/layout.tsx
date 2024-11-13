"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "./globals.css";
import Navigation from "@/components/Navigation";

interface LayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <SessionProvider>
          <Navigation />
          {children}
        </SessionProvider>
        <footer className="text-center text-gray-500 text-sm p-4">
          &copy; {new Date().getFullYear()} DeelDepot -{" "}
          <a href="/dev-info" className="text-blue-400 hover:underline">
            Developer Info
          </a>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
