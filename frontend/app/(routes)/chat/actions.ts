"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function postMessage(roomId: string, content: string, userId: string) {
  const session = await getServerSession(authOptions);
  const BEARER_TOKEN = session?.user.strapiToken;

  if (!BEARER_TOKEN) {
    throw new Error("Bearer token is not defined");
  }

  const mutation = `
        mutation($data: MessageInput!) {
            createMessage(data: $data) {
                message {
                    id
                    content
                    createdAt
                    user {
                        id
                        username
                    }
                }
            }
        }
    `;
  if (!API_URL) {
    throw new Error("API_URL is not defined");
  }
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        data: {
          content,
          room: roomId,
          user: userId,
        },
      },
    }),
  });

  const result = await response.json();
  return result.data.createMessage.message;
}
