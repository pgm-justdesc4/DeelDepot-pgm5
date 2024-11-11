// ManageUsers.tsx
"use client";
import React, { useEffect, useState } from "react";
import { gql, GraphQLClient } from "graphql-request";
import { useSession } from "next-auth/react";
import { User } from "@/types/User";

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user.strapiToken) {
      return;
    }

    const fetchUsers = async () => {
      const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
      const restEndpoint = `${endpoint}/api/users`;
      const token = session?.user.strapiToken;

      try {
        const response = await fetch(restEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users from REST API");
        }

        const data = await response.json();
        const usersWithRoles = await fetchUserRoles(data);
        setUsers(usersWithRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchUserRoles = async (users: User[]) => {
      const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
      const graphQLClient = new GraphQLClient(`${endpoint}/graphql`, {
        headers: {
          Authorization: `Bearer ${session?.user.strapiToken}`,
        },
      });

      const fetchUserRoleQuery = gql`
        query getUserRoles {
          usersPermissionsRoles {
            users {
              documentId
            }
            documentId
            name
          }
        }
      `;

      try {
        const userRoleResponse = await graphQLClient.request(
          fetchUserRoleQuery
        );
        const roles = (userRoleResponse as { usersPermissionsRoles: any })
          .usersPermissionsRoles;

        return users.map((user) => {
          const userRole = roles.find((role: any) =>
            role.users.some((u: any) => u.documentId === user.documentId)
          );
          return {
            ...user,
            role: userRole ? { name: userRole.name } : undefined,
          };
        });
      } catch (error) {
        console.error("Error fetching user roles:", error);
        return users;
      }
    };

    fetchUsers();
  }, [session]);

  const toggleBlockUser = async (userId: number, blocked: boolean) => {
    const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
    const graphQLClient = new GraphQLClient(`${endpoint}/graphql`, {
      headers: {
        Authorization: `Bearer ${session?.user.strapiToken}`,
      },
    });

    const mutation = gql`
      mutation UpdateUsersPermissionsUser(
        $updateUsersPermissionsUserId: ID!
        $data: UsersPermissionsUserInput!
      ) {
        updateUsersPermissionsUser(
          id: $updateUsersPermissionsUserId
          data: $data
        ) {
          data {
            blocked
          }
        }
      }
    `;

    try {
      await graphQLClient.request(mutation, {
        updateUsersPermissionsUserId: userId,
        data: { blocked },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, blocked } : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const updateUserRole = async (userId: number, roleName: string) => {
    const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
    const token = session?.user.strapiToken;

    try {
      // Fetch the role ID using the REST API
      const roleResponse = await fetch(
        `${endpoint}/api/users-permissions/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!roleResponse.ok) {
        throw new Error("Failed to fetch roles from REST API");
      }

      const roleData = await roleResponse.json();
      const roles = roleData.roles;

      const role = roles.find((r: any) => r.name === roleName);

      if (!role) {
        throw new Error(`Role ID not found for role name: ${roleName}`);
      }

      const roleId = role.id;

      const graphQLClient = new GraphQLClient(`${endpoint}/graphql`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mutation = gql`
        mutation UpdateUsersPermissionsUser(
          $updateUsersPermissionsUserId: ID!
          $data: UsersPermissionsUserInput!
        ) {
          updateUsersPermissionsUser(
            id: $updateUsersPermissionsUserId
            data: $data
          ) {
            data {
              role {
                name
              }
            }
          }
        }
      `;

      await graphQLClient.request(mutation, {
        updateUsersPermissionsUserId: userId,
        data: { role: roleId },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: { name: roleName } } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users &&
        users.map((user) => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
            <p className="mb-2">{user.email}</p>
            <p
              className={`mb-4 ${
                user.blocked ? "text-red-500" : "text-green-500"
              }`}
            >
              {user.blocked ? "Blocked" : "Active"}
            </p>
            <p className="mb-4">
              Role: {user.role?.name || "No role assigned"}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleBlockUser(user.id, !user.blocked)}
                className={`py-2 px-4 rounded ${
                  user.blocked
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
              >
                {user.blocked ? "Unblock" : "Block"}
              </button>
              <button
                onClick={() =>
                  updateUserRole(
                    user.id,
                    user.role?.name === "Authenticated"
                      ? "Admin"
                      : "Authenticated"
                  )
                }
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {user.role?.name === "Authenticated"
                  ? "Make Admin"
                  : "Make Authenticated"}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ManageUsers;
