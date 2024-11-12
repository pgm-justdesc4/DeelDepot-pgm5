"use client";
import React, { useState, useRef, useEffect } from "react";
import { Message } from "@/types/Message";
import { createChatMessage, triggerPusherEvent } from "./actions";
import { pusherClient } from "@/lib/pusher";

interface ChatProps {
  messages: Message[];
  userId: string;
  username: string;
  chatroomId: string;
  pusherInstance: any;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  userId,
  username,
  chatroomId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newMessages, setNewMessages] = useState<Message[]>(messages);
  const isEventBound = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [newMessages]);

  useEffect(() => {
    if (!isEventBound.current) {
      pusherClient.subscribe(chatroomId);

      pusherClient.bind(
        "incoming-message",
        (data: { content: string; userId: string; username: string }) => {
          const {
            content,
            userId: receivedUserId,
            username: receivedUsername,
          } = data;
          console.log("incoming-message", data);
          setNewMessages((prevMessages) => [
            ...prevMessages,
            {
              userId: receivedUserId,
              content: content,
              user: {
                id: receivedUserId,
                documentId: receivedUserId,
                username: receivedUsername,
              },
            },
          ]);
        }
      );

      isEventBound.current = true;
    }

    return () => {
      pusherClient.unsubscribe(chatroomId);
      pusherClient.unbind("incoming-message");
      isEventBound.current = false;
    };
  }, [chatroomId]);

  const sendMessage = async () => {
    const message = { text: newMessage, userId, username };
    triggerPusherEvent({
      chatroomId: chatroomId,
      userId,
      username,
      content: newMessage,
    });
    await createChatMessage({
      content: message.text,
      userId,
      chatroomId: chatroomId,
    }); // Save the message to the database
    setNewMessage("");
  };

  return (
    <div>
      <div className="h-64 overflow-y-auto mb-4">
        {newMessages.length === 0 && (
          <div className="text-center text-gray-500">
            Start the conversation
          </div>
        )}
        {newMessages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded mb-2 ${
              message.user?.documentId === userId
                ? "bg-blue-200 text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {message.user?.documentId !== userId && (
              <div className="text-xs text-gray-500 mb-1">
                {message.user?.username}
              </div>
            )}
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
