"use client";
import React, { useState, useEffect } from "react";
import { gql, request } from "graphql-request";
import { useSession } from "next-auth/react";
import DeleteButton from "./components/DeleteButton";
import { Chatroom } from "@/types/chatroom";
import Loader from "@/components/common/Loader";

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

const DELETE_CHATROOM = gql`
  mutation Mutation($documentId: ID!) {
    deleteChatroom(documentId: $documentId) {
      documentId
    }
  }
`;

const ChatPage: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  // Fetch chatrooms on component mount
  useEffect(() => {
    async function initialize() {
      if (session?.user.strapiToken) {
        const fetchedChatrooms = await fetchChatrooms(session.user.strapiToken);
        setChatrooms(fetchedChatrooms);
        setLoading(false);
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

  // Display loader while fetching chatrooms
  if (loading) {
    return <Loader className="my-10" />;
  }

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-4">Messages</h1>
      {chatrooms.length === 0 ? (
        <p className="text-center text-gray-500">No messages found.</p>
      ) : (
        <ul className="space-y-2">
          {chatrooms.map((room: Chatroom) => (
            <li
              key={room.documentId}
              className="p-2 pr-5 bg-gray-100 max-w-4xl mx-auto rounded shadow flex justify-between items-center"
            >
              <div className="flex justify-between gap-5 items-center">
                <a
                  href={`/chat/${room.documentId}`}
                  className="text-blue-500 ml-7 hover:underline"
                >
                  {room.title}
                </a>
                <p className="text-sm text-gray-600">
                  Users:{" "}
                  <strong>
                    {Array.isArray(room.users_permissions_users) &&
                      room.users_permissions_users
                        .map(
                          (user: { documentId: string; username: string }) =>
                            user.username
                        )
                        .join(", ")}
                  </strong>
                </p>
              </div>
              <DeleteButton
                handleDeleteRoom={() => handleDeleteRoom(room.documentId)}
                room={room}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatPage;
