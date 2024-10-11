import React from "react";

interface User {
  name: string;
}

interface Props {
  user: User;
}

const HelloMessage: React.FC<Props> = ({ user }) => {
  return (
    <div>
      <h1>Hello, {user.name}!</h1>
    </div>
  );
};

export default HelloMessage;
