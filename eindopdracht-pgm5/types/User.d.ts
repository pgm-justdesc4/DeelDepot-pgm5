import UserRole from "./UserRole";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string | null;
  githubId: string | null;
  googleId: string | null;
  role: UserRole;
};
