export interface Message {
  userId: string;
  content: string;
  user: {
    documentId: string;
    username: string;
  };
}
