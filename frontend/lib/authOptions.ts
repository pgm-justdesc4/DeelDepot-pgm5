import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { UserRole } from "@/types/UserRole";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Authenticate the user
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                identifier: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to authenticate");
          }

          const data = await response.json();
          const { user, jwt } = data;

          if (!user || !user.confirmed || user.blocked) {
            throw new Error("User not confirmed or blocked");
          }

          // Fetch the user role
          const roleResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}?populate=role`
          );

          if (!roleResponse.ok) {
            throw new Error("Failed to fetch user role");
          }

          const roleData = await roleResponse.json();
          const roleName = roleData.role.name;

          return {
            id: user.id,
            name: user.username || "Unknown",
            email: user.email,
            role: roleName,
            documentId: user.documentId,
            strapiToken: jwt,
          };
        } catch (error) {
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (
        user &&
        account &&
        (account.provider === "github" || account.provider === "google")
      ) {
        // Check if user exists in Strapi
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users?filters[email][$eq]=${user.email}`
        );

        let strapiUser;
        if (response.ok) {
          const users = await response.json();
          if (users.length > 0) {
            strapiUser = users[0];
          } else {
            // Create user in Strapi
            const password = Math.random().toString(36).slice(-8);
            const createUserResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: user.name,
                  email: user.email,
                  password: password,
                }),
              }
            );

            if (!createUserResponse.ok) {
              const errorBody = await createUserResponse.text();
              console.error(
                "Failed to create user in Strapi",
                createUserResponse.status,
                errorBody
              );
              throw new Error("Failed to create user in Strapi");
            }

            strapiUser = await createUserResponse.json();

            // Fetch the JWT token for the newly created user
            const tokenResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  identifier: user.email,
                  password: password,
                }),
              }
            );

            if (!tokenResponse.ok) {
              const errorBody = await tokenResponse.text();
              console.error(
                "Failed to fetch JWT token from Strapi",
                tokenResponse.status,
                errorBody
              );
              throw new Error("Failed to fetch JWT token from Strapi");
            }

            const tokenData = await tokenResponse.json();
            strapiUser.jwt = tokenData.jwt;
          }
        } else {
          const errorBody = await response.text();
          console.error(
            "Failed to fetch user from Strapi",
            response.status,
            errorBody
          );
          throw new Error("Failed to fetch user from Strapi");
        }

        token.id = strapiUser.id;
        token.role = "thirdParty";
        token.documentId = strapiUser.documentId;
        token.strapiToken = strapiUser.jwt;
      } else if (user) {
        token.id = user.id;
        token.role = user.role;
        token.documentId = user.documentId;
        token.strapiToken = user.strapiToken;
      } else if (trigger === "update") {
        token.name = session.user.name;
        token.email = session.user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as UserRole;
        session.user.documentId = token.documentId as string;
        session.user.strapiToken = token.strapiToken as string;
      }
      return session;
    },
  },
};
