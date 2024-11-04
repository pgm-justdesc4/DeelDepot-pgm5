import UserRole from "./UserRole";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      documentId: string;
      name?: string | null;
      email?: string | null;
      role?: UserRole;
      strapiToken?: string;
    };
  }

  interface User {
    id: number;
    documentId: string;
    name?: string | null;
    email?: string | null;
    role?: UserRole;
    strapiToken?: string;
  }
}
