import React from "react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center text-gray-900 mb-10 sm:mb-16 md:mb-20">
        DeelDepot
      </h1>
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
          Login
        </h2>
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
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
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
            <div className="text-sm mt-2 sm:mt-0">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don&apos;t have an account yet?
              </a>
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
        </form>
      </div>
    </div>
  );
}
