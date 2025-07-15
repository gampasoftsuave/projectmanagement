import Link from "next/link";
import { useAuthContext } from "./AuthContext";
import { User } from "lucide-react";

export default function AuthButton() {
  const { user, signOut } = useAuthContext();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
      {user ? (
        <>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 w-full sm:w-auto justify-center sm:justify-start min-w-0 max-w-full">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-200 min-w-7">
              <User className="w-5 h-5 text-blue-600" />
            </span>
            <span className="text-blue-700 font-medium text-base mr-1 break-all whitespace-normal max-w-full">
              {user.name}
            </span>
          </div>
          <button
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-base font-medium border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer w-full sm:w-auto mt-2 sm:mt-0 min-w-0 max-w-full truncate"
            onClick={signOut}
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-base font-medium border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <User className="w-5 h-5 text-white" />
          <span>Sign In</span>
        </Link>
      )}
    </div>
  );
}
