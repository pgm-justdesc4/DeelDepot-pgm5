"use server";

import { gql, request } from "graphql-request";
import { Message } from "@/types/Message";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const STRAPI_GRAPHQL_URL = `${baseUrl}/graphql`;

const CREATE_CHATMESSAGE = gql`
  mutation CreateChatmessage($data: ChatmessageInput!) {
    createChatmessage(data: $data) {
      createdAt
      content
      chatroom {
        documentId
      }
      users_permissions_users {
        username
        documentId
      }
    }
  }
`;

export const createChatMessage = async ({
  content,
  chatroomId,
  userId,
}: {
  content: string;
  chatroomId: string;
  userId: string;
}) => {
  console.log("createChatMessage", content, chatroomId, userId);
  if (content.trim() === "") return;

  const session = await getServerSession(authOptions);
  const STRAPI_API_TOKEN = session?.user.strapiToken || "";

  const headers = {
    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  };

  try {
    const response = await request<{ createChatmessage: { message: Message } }>(
      STRAPI_GRAPHQL_URL,
      CREATE_CHATMESSAGE,
      {
        data: {
          content,
          chatroom: chatroomId,
          users_permissions_users: userId,
        },
      },
      headers
    );
    if (response.createChatmessage) {
      console.log("response.createChatmessage", response.createChatmessage);
      return response.createChatmessage.message;
    }
  } catch (error) {
    console.error("Error creating message:", error);
  }
};

export const triggerPusherEvent = async ({
  chatroomId,
  userId,
  content,
  username,
}: {
  chatroomId: string;
  userId: string;
  content: string;
  username: string;
}) => {
  pusherServer.trigger(chatroomId, "incoming-message", {
    userId,
    username,
    content,
  });
};
