import Image from "next/image";
import { CreateContest } from "@/app/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-8 p-4">
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Comme Tu Veux
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        <CreateContest />

        <button className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg">
          Join Group
        </button>
      </div>
    </div>
  );
}
