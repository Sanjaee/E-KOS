import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Mail,
  Calendar,
  LogOut,
  BellRing,
  ShieldCheck,
  Lock,
  Sun,
  Moon,
} from "lucide-react";
import { BsTiktok } from "react-icons/bs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const ProfileLayout = () => {
  const { data: session, status }: any = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  const handleChangePass = () => {
    router.push("/auth/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Banner Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 md:h-64">
        {/* Logout Button positioned in the top-right corner */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md md:mt-44 z-50 md:mr-10"
          >
            <LogOut className="w-5 h-5 dark:text-lightBg text-darkBg" />
            <span className="dark:text-lightBg text-darkBg">Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-40">
        <div className="relative -mt-24">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Theme toggle - diubah posisinya di desktop */}
            <div className="flex justify-end md:justify-start mb-6">
              <button
                onClick={toggleTheme}
                className="p-2 ml-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-6 h-6 text-amber-400" />
                ) : (
                  <Moon className="w-6 h-6 text-indigo-600" />
                )}
              </button>
            </div>

            {/* Profile Header */}
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  {session?.user?.image ? (
                    <img
                      src={session?.user?.image}
                      alt={session?.user?.name || "User"}
                      className="w-24 h-24 rounded-full shadow"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-4xl text-gray-600 dark:text-gray-300">
                        {session?.user?.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session?.user?.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Rest of the profile content remains the same */}
            {/* Profile Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    About
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Profile connected with Google Account
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Mail className="w-5 h-5" />
                      <span>{session?.user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Calendar className="w-5 h-5" />
                      <span>
                        Joined{" "}
                        {new Date().toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activities
                  </h2>
                  <div className="space-y-3">
                    {session?.user?.role === "admin" ? (
                      <Link
                        href="/admin/consultations"
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <BellRing className="w-5 h-5" />
                        <span>Reply Consultation</span>
                      </Link>
                    ) : (
                      <Link
                        href="/consultations/history"
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <BellRing className="w-5 h-5" />
                        <span>Consultation History</span>
                      </Link>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Account Settings
                  </h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleChangePass()}
                      className="w-full py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center gap-3 group"
                    >
                      <Lock className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        Change Password
                      </span>
                    </button>

                    <button className="w-full py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center gap-3 group">
                      <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        Privacy Settings
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
