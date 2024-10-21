import UserRole from "./UserRole";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username?: string | null;
      email?: string | null;
      role?: UserRole;
    };
  }

  interface User {
    id: number;
    username?: string | null;
    email?: string | null;
    role?: UserRole;
  }
}
