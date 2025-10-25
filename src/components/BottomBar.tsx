import React, { useEffect, useState } from "react";
import { Home, User, Folder, Bookmark, BellRing } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

const BottomBar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => setMounted(true), []);

  // Mendeteksi apakah user adalah admin
  useEffect(() => {
    if (session?.user) {
      // Periksa role user dari session
      const userRole = session.user.role;
      setIsAdmin(userRole === "admin" || userRole === "superadmin");
    }
  }, [session]);

  // Menentukan href untuk notifikasi berdasarkan status admin
  const getNotificationHref = () => {
    if (!session) {
      return "/auth/login?from=home"; // Redirect ke login jika belum login
    }

    return isAdmin ? "/admin/consultations" : "/consultations/history";
  };

  const menuItems = [
    { icon: <Home className="w-6 h-6" />, label: "Home", href: "/" },
    { icon: <User className="w-6 h-6" />, label: "Profile", href: "/profile" },
    { icon: <Folder className="w-6 h-6" />, label: "Files", href: "/blog" },
    {
      icon: <Bookmark className="w-6 h-6" />,
      label: "Favorite",
      href: "/favorite",
    },
    {
      icon: <BellRing className="w-6 h-6" />,
      label: "Notification",
      href: getNotificationHref(),
    },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="relative">
        {/* Blur effect background */}
        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 backdrop-blur-lg rounded-full" />

        {/* Navigation items */}
        <div className="relative flex items-center gap-4 px-4 py-2 rounded-full">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="p-2 rounded-full text-white/80 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors duration-200"
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
