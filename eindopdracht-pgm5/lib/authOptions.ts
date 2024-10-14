import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { users } from "./users";
import { UserRole } from "@/types/UserRole";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        firstname: { label: "First Name", type: "text" },
        lastname: { label: "Last Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, firstname, lastname } = credentials;
        let user = users.find((user) => user.email === email);

        if (!user) {
          // Register new user
          const hashedPassword = await bcrypt.hash(password, 10);
          user = {
            id: users.length + 1,
            firstname,
            lastname,
            email,
            githubId: null,
            googleId: null,
            password: hashedPassword,
            role: "user" as UserRole,
          };
          users.push(user);
        } else {
          // Authenticate existing user
          const isValid = await bcrypt.compare(
            password as string,
            user.password as string
          );
          if (!isValid) {
            return null;
          }
        }

        return {
          id: user.id,
          name: `${user.firstname} ${user.lastname}`,
          email: user.email,
          role: user.role,
        };
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
    async jwt({ token, user, account }) {
      if (
        user &&
        account &&
        (account.provider === "github" || account.provider === "google")
      ) {
        token.role = user.role || "user";
      } else if (user) {
        token.role = user.role;
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
