"use server";

import { gql, request } from "graphql-request";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const STRAPI_GRAPHQL_URL = `${baseUrl}/graphql`;

type GraphQLMessage = {
  createdAt: string;
  content: string;
  documentId: string;
  users_permissions_user?: {
    userId: string;
    username: string;
    documentId: string;
  };
};

export const fetchChatroomDetails = async (
  chatroomId: string,
  token: string
) => {
  const query = `
    query Query($documentId: ID!) {
      chatroom(documentId: $documentId) {
        title
        users_permissions_users {
          username
        }
      }
    }
  `;

  const variables = {
    documentId: chatroomId,
  };

  const response = await fetch(`${baseUrl}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error(
      `Failed to fetch chatroom details: ${response.status} - ${errorMessage}`
    );
    throw new Error("Failed to fetch chatroom details");
  }

  const result = await response.json();
  return result.data.chatroom;
};

export const fetchMessages = async (roomId: string, token: string) => {
  const GET_MESSAGES = gql`
    query Chatmessages($filters: ChatmessageFiltersInput) {
      chatmessages(filters: $filters, pagination: { limit: -1 }) {
        createdAt
        content
        documentId
        users_permissions_user {
          documentId
          username
        }
      }
    }
  `;

  const variables = {
    filters: {
      chatroom: {
        documentId: {
          eq: roomId,
        },
      },
    },
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response: { chatmessages: GraphQLMessage[] } = await request(
    STRAPI_GRAPHQL_URL,
    GET_MESSAGES,
    variables,
    headers
  );
  console.log(response);
  const chatmessages = response.chatmessages.map((message) => {
    if (!message.users_permissions_user) {
      message.users_permissions_user = {
        userId: "",
        documentId: "",
        username: "unknown",
      };
    }
    return {
      ...message,
      user: {
        id: message.users_permissions_user.documentId,
        username: message.users_permissions_user.username,
      },
    };
  });
  return chatmessages;
};
