"use client";

import React, { useState } from "react";

interface AddRoomProps {
  handleAddRoom: (roomName: string) => void;
}

const AddRoom = ({ handleAddRoom }: AddRoomProps) => {
  const [newRoomName, setNewRoomName] = useState("");

  const handleClick = () => {
    // Add room logic here
    console.log(`Room added: ${newRoomName}`);
    handleAddRoom(newRoomName);
    setNewRoomName("");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="text"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
        placeholder="New room name"
        className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Room
      </button>
    </div>
  );
};

export default AddRoom;
