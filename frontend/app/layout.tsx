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
      </body>
    </html>
  );
};

export default RootLayout;
