export type Product = {
  documentId: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  images: { url: string }[];
  available: boolean;
  user: { id: number; documentId: string; username: string };
};
