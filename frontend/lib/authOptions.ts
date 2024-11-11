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
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}?populate=role`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
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
        token.id = user.id;
        token.role = "thirdParty";
        token.documentId = user.documentId;
        token.strapiToken = user.strapiToken;
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
