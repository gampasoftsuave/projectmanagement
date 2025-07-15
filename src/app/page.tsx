"use client";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import "@/styles/custom-animations.css";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white/80 shadow-2xl rounded-3xl p-10 max-w-xl w-full flex flex-col items-center animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-4 p-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg animate-slide-down">
          Welcome to the Projects App
        </h1>
        <p className="mb-8 text-lg text-gray-700 text-center animate-fade-in-delay">
          Manage your projects easily with full CRUD functionality.
        </p>
        <Link
          href={ROUTES.PROJECTS}
          className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:scale-105 transition-transform duration-200 text-white px-6 py-3 rounded-xl text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 animate-pop"
        >
          Go to Projects
        </Link>
      </div>
    </div>
  );
}
