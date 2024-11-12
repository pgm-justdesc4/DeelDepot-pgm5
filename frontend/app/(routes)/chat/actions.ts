"use server";
import { Message } from "@/types/Message";
import request, { gql } from "graphql-request";
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const BEARER_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

async function postMessage(roomId: string, content: string, userId: string) {
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
