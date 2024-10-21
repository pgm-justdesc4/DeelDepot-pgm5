declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      firstname?: string | null;
      lastname?: string | null;
      email?: string | null;
      role?: UserRole;
    };
  }

  interface User {
    id: number;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    role?: UserRole;
  }
}
