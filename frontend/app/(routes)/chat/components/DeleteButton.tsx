"use client";
import React from "react";

interface DeleteButtonProps {
  handleDeleteRoom: (id: string) => Promise<void>;
  room: { documentId: string };
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  handleDeleteRoom,
  room,
}) => {
  return (
    <button
      className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-700"
      onClick={async () => {
        await handleDeleteRoom(room.documentId);
      }}
    >
      Delete
    </button>
  );
};

export default DeleteButton;
