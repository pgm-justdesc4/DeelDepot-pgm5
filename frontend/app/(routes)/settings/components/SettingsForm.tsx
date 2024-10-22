"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { gql, GraphQLClient } from "graphql-request";

const UPDATE_USER = gql`
  mutation Mutation(
    $updateUsersPermissionsUserId: ID!
    $data: UsersPermissionsUserInput!
  ) {
    updateUsersPermissionsUser(id: $updateUsersPermissionsUserId, data: $data) {
      data {
        username
        email
      }
    }
  }
`;

const SettingsForm: React.FC = () => {
  const { data: session, update } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.id) {
      try {
        const client = new GraphQLClient(
          `${process.env.NEXT_PUBLIC_API_URL}/graphql`
        );
        const variables = {
          updateUsersPermissionsUserId: session.user.id,
          data: {
            username,
            email,
          },
        };
        const response: {
          updateUsersPermissionsUser: {
            data: { username: string; email: string };
          };
        } = await client.request(UPDATE_USER, variables);

        const updatedUser = {
          ...session.user,
          name: response.updateUsersPermissionsUser.data.username,
          email: response.updateUsersPermissionsUser.data.email,
        };

        await update({ user: updatedUser, trigger: "update" });

        alert("User updated successfully");
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user");
      }
    } else {
      console.error("No user ID found in session");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Update
      </button>
    </form>
  );
};

export default SettingsForm;
