import UserRole from "./UserRole";

export type User = {
  id: id;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  password: string | null;
  resetPasswordToken: string | null;
  confirmationToken: string | null;
  confirmed: boolean;
  blocked: boolean;
  role: UserRole;
};
