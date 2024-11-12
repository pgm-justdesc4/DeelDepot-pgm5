"use client";
import { useState, useEffect } from "react";
import { gql, request } from "graphql-request";
import { useSession } from "next-auth/react";
import DeleteButton from "./components/DeleteButton";
import { Chatroom } from "@/types/chatroom";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const STRAPI_GRAPHQL_URL = `${baseUrl}/graphql`;

const GET_CHATROOMS = gql`
  query Chatrooms {
    chatrooms {
      documentId
      createdAt
      title
      users_permissions_users {
        documentId
        username
      }
    }
  }
`;

const ADD_CHATROOM = gql`
  mutation CreateChatroom($data: ChatroomInput!) {
    createChatroom(data: $data) {
      documentId
      title
      users_permissions_users {
        username
        documentId
      }
    }
  }
`;

const DELETE_CHATROOM = gql`
  mutation Mutation($documentId: ID!) {
    deleteChatroom(documentId: $documentId) {
      documentId
    }
  }
`;

const ChatPage = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const { data: session } = useSession();

  // Fetch chatrooms on component mount
  useEffect(() => {
    async function initialize() {
      if (session?.user.strapiToken) {
        const fetchedChatrooms = await fetchChatrooms(session.user.strapiToken);
        setChatrooms(fetchedChatrooms);
      }
    }

    initialize();
  }, [session]);

  // Fetch chatrooms from Strapi
  async function fetchChatrooms(token: string) {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await request<{ chatrooms: Chatroom[] }>(
      STRAPI_GRAPHQL_URL,
      GET_CHATROOMS,
      {},
      headers
    );
    // Filter chatrooms where the user is a member
    const userChatrooms = response.chatrooms.filter(
      (chatroom) =>
        Array.isArray(chatroom.users_permissions_users) &&
        chatroom.users_permissions_users.some(
          (user: { documentId: string; username: string }) =>
            user.documentId === session?.user.documentId
        )
    );
    return userChatrooms;
  }

  // Handle deleting a room
  const handleDeleteRoom = async (documentId: string) => {
    const headers = {
      Authorization: `Bearer ${session?.user.strapiToken}`,
    };

    try {
      await request(
        STRAPI_GRAPHQL_URL,
        DELETE_CHATROOM,
        { documentId },
        headers
      );
      setChatrooms(chatrooms.filter((room) => room.documentId !== documentId));
    } catch (error) {
      console.error("Error deleting chatroom:", error);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chatrooms</h1>
      <ul className="space-y-2">
        {chatrooms.map((room: Chatroom) => (
          <li
            key={room.documentId}
            className="p-2 bg-gray-100 rounded shadow flex justify-between items-center"
          >
            <a
              href={`/chat/${room.documentId}`}
              className="text-blue-500 hover:underline"
            >
              {room.title}
            </a>
            {room.users_permissions_users &&
              room.users_permissions_users.documentId ===
                session?.user?.documentId && (
                <DeleteButton
                  handleDeleteRoom={() => handleDeleteRoom(room.documentId)}
                  room={room}
                />
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatPage;
