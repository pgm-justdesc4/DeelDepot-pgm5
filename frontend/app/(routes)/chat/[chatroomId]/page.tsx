import Chat from "./components/chat";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { fetchMessages, fetchChatroomDetails } from "./actions";

interface PageProps {
  params: {
    chatroomId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);
  const { chatroomId } = params;

  const strapiToken = session?.user.strapiToken as string;
  const messages = ((await fetchMessages(chatroomId, strapiToken)) || []).map(
    (message: any) => ({
      ...message,
      userId: message.user.id,
    })
  );
  const userId = session?.user.documentId as string;

  let chatroomName = "Chatroom";
  let users = [];

  try {
    const chatroomDetails = await fetchChatroomDetails(chatroomId, strapiToken);
    chatroomName = chatroomDetails.title;
    users = chatroomDetails.users_permissions_users;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="max-w-6xl mx-auto pt-3">
      <a href="/chat" className="mb-4 text-blue-500 text-lg">
        {" "}
        &larr; Back to chatrooms
      </a>
      <div className="flex flex-col items-center justify-center pt-12 p-4">
        <h1 className="text-3xl font-bold mb-4">Chatroom: {chatroomName}</h1>
        <div className="text-lg mb-4">
          <p>Users:</p>
          {users.map((user: any) => (
            <span key={user.username} className="mr-2">
              {user.username}
            </span>
          ))}
        </div>
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4">
          <Chat
            messages={messages}
            userId={userId}
            chatroomId={chatroomId}
            username={session?.user.name as string}
            pusherInstance=""
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
