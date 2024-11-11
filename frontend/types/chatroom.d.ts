export type Chatroom = {
  documentId: string;
  title: string;
  creatorId: {
    documentId: string;
    username: string;
  };
};
