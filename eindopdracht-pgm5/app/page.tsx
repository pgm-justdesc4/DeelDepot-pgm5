import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/authOptions";
import LoginButton from "@/components/common/LoginButton";
import LogoutButton from "@/components/common/LogoutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Deeldepot</h1>
      <p className="text-lg text-gray-700 text-center max-w-md">
        Dit is de homepage. Je bent {session ? "ingelogd" : "niet ingelogd"}.
        <br />
        {session ? `Jouw rol is: - ${session.user.role}.` : ""}
      </p>
      {session ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}
