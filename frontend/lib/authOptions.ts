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
            const errorText = await response.text();
            throw new Error("Failed to authenticate");
          }

          const data = await response.json();
          const { user } = data;

          if (!user || !user.confirmed || user.blocked) {
            throw new Error("User not confirmed or blocked");
          }

          return {
            id: user.id,
            name: user.username || "Unknown",
            email: user.email,
            role: user.role?.name || "user",
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
        token.role = user.role || "user";
      } else if (user) {
        token.id = user.id;
        token.role = user.role;
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
      }
      return session;
    },
  },
};
