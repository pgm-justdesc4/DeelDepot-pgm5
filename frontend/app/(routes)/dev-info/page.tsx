import React from "react";

const DeveloperInfoPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Developer Info - DeelDepot
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Your Guide to Understanding and Using DeelDepot
        </p>
      </header>

      {/* Overview Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 ml-1 mb-4">
          Project Overview
        </h2>
        <p className="text-gray-700 leading-relaxed">
          DeelDepot is a Next.js 14 application that provides a platform for
          users to share and manage a community inventory of products. The goal
          of the application is to make it easy for users to borrow, lend, or
          explore items available in their area. Built using PostgreSQL for
          reliable data management, DeelDepot ensures a responsive,
          user-friendly experience.
        </p>
      </section>

      {/* Project Explanation Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">
          How DeelDepot Works
        </h2>

        {/* Homepage Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Homepage</h3>
          <p className="text-gray-700 leading-relaxed">
            Upon visiting DeelDepot, users are greeted with a homepage that
            displays a small overview of available products. From here, users
            can click on &quot;View All&quot; to navigate to the Products page,
            where they’ll find a complete list of items.
          </p>
        </div>

        {/* Products Page Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Products page</h3>
          <p className="text-gray-700 leading-relaxed">
            The Products page provides a searchable and filterable list of all
            items. Users can:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
            <li>Search for specific products by name or keywords.</li>
            <li>
              Filter the items by &quot;All&quot; or &quot;Available&quot; to
              see only currently available products.
            </li>
          </ul>
        </div>

        {/* Product Detail Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Product Detail
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Each product in DeelDepot has its own detail page where users can
            view specific information, such as the product’s description,
            availability, and owner details. Key features include:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
            <li>
              <strong>Product Information:</strong> Detailed description,
              availability status, and other relevant details of the item.
            </li>
            <li>
              <strong>Contact Owner:</strong> Users can click the
              &quot;Contact&quot; button to start a direct chat with the product
              owner for inquiries or rental arrangements. This conversation is
              saved in the inbox, accessible from the navigation bar, allowing
              users to revisit chats anytime.
            </li>
          </ul>
        </div>

        {/* User Registration and Login Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Register/Login
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Users can register for a new account or log into an existing one.
            Upon logging in, users gain access to their personal Dashboard,
            where they can manage their interactions within the platform.
          </p>
        </div>

        {/* Dashboard Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Dashboard</h3>
          <p className="text-gray-700 leading-relaxed">
            The Dashboard is where users can manage their own products and
            update personal settings. Key features include:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
            <li>
              <strong>Manage Products:</strong> Users can add, update, or delete
              their own products.
            </li>
            <li>
              <strong>Account Settings:</strong> Users can update their email or
              username in this section.
            </li>
          </ul>
        </div>

        {/* Admin Panel Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Admin Panel</h3>
          <p className="text-gray-700 leading-relaxed">
            As part of a demonstration for educational purposes, DeelDepot
            includes an example Admin Panel. This section is not accessible to
            regular users, but can be explored with designated credentials
            (admin@example.com / pw: admin123). In this panel, admins have
            special permissions, such as: Managing all users, with options to
            block users or change their roles.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Admin access is restricted and meant for demonstration purposes
            only, highlighting the app&apos;s extended functionalities.
          </p>
        </div>
      </section>

      {/* Technical Documentation Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          {/* Tech Stack */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Tech Stack</h3>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
              <li>Next.js 14</li>
              <li>Tailwind CSS</li>
              <li>Strapi + GraphQL</li>
              <li>PostgreSQL</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperInfoPage;
