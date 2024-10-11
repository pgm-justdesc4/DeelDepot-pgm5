export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Deeldepot</h1>
      <p className="text-lg text-gray-700 text-center max-w-md">
        Dit is de homepage, hier kan je enkel terecht wanneer je bent{" "}
        <strong>ingelogd</strong>, anders redirect to /login.
      </p>
    </div>
  );
}
