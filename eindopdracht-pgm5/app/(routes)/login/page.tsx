"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  const handleLoginWithGitHub = async () => {
    const res = await signIn("github", { redirect: false });
    if (!res?.error) {
      router.push("/");
    }
  };

  const handleLoginWithGoogle = async () => {
    const res = await signIn("google", { redirect: false });
    if (!res?.error) {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center text-gray-900 mb-10 sm:mb-16 md:mb-20">
        DeelDepot
      </h1>
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
          Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="-mt-px">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <div className="text-sm mt-2 sm:mt-0">
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don&apos;t have an account yet? Register now.
              </a>
            </div>
          </div>
        </form>
        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <button
            onClick={handleLoginWithGitHub}
            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md group hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sign in with GitHub
          </button>
          <button
            onClick={handleLoginWithGoogle}
            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md group hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
