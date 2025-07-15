"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/AuthContext";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const { signIn } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await signIn(username, password);
    if (!ok) setError("Invalid credentials (username = password)");
    else router.replace("/projects?toast=login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 relative">
      <button
        type="button"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold transition"
        onClick={() => window.history.back()}
        aria-label="Go back"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Go Back
      </button>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <Lock className="w-10 h-10 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h2>
          <p className="text-gray-500 text-sm">Access your project</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="username"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 outline-none transition"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 outline-none transition"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white rounded-lg px-3 py-2 font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
