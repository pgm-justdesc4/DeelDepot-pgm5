declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      role?: UserRole;
    };
  }

  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  }
}
