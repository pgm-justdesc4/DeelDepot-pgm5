// components/LoginButton.tsx
"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn()}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      Login
    </button>
  );
}
