export interface Message {
  userId: string;
  content: string;
  user: {
    id: string;
    username: string;
  };
}
