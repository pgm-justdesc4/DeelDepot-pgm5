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
    <div className="max-w-4xl mx-auto pt-6">
      <a href="/chat" className="mb-6 text-blue-600 text-lg hover:underline">
        &larr; Back to chatrooms
      </a>
      <div className="flex flex-col items-center pt-8 px-4">
        <h1 className="text-4xl font-bold mb-6">{chatroomName}</h1>
        <div className="text-lg mb-6">
          <p className="font-semibold text-gray-600">Users:</p>
          <div className="flex flex-wrap">
            {users.map((user: any) => (
              <span
                key={user.username}
                className="mr-2 mb-2 bg-gray-200 px-2 py-1 rounded"
              >
                {user.username}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
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
