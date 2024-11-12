import Link from "next/link";

const HelloMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        You must be redirected to the wrong page.
      </h1>
      <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
        Back to Home
      </Link>
    </div>
  );
};

export default HelloMessage;
