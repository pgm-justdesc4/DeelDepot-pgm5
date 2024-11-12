export interface Message {
  userId: string;
  content: string;
  user: {
    id: string;
    documentId: string;
    username: string;
  };
}
