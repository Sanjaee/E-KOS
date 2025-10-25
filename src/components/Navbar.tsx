"use client";
import React, { useState, useRef, useEffect } from "react";
import BottomBar from "./BottomBar";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, LogIn, LogOut, Heart, Code, BellRing, FileText, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const products = [
  {
    title: "CV Programmer",
    href: "/blog/22",
    src: "https://res.cloudinary.com/dgmlqboeq/image/upload/v1732347486/folder%20BLOG%20ZACODE/Screenshot_2024-11-23_143740_yozf1m.png",
    description: "Template CV (Curriculum Vitae) All Programmer.",
  },
];

const ProfileButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  // If user is not logged in, show sign in button with ORIGINAL STYLE
  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-white backdrop-blur-lg px-4 py-2 text-base dark:text-darkBg font-semibold text-shadow-gray-600/50 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl shadow-gray-600/50 border-2 border-gray-800/20"
      >
        <span className="text-[14px] ">Sign In</span>
        <LogIn className="ml-2" />
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
          <div className="relative h-full w-10 bg-black/20"></div>
        </div>
      </Link>
    );
  }

  // If user is logged in, show profile dropdown with ORIGINAL STYLE
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-red-400 dark:hover:ring-red-400 transition-all duration-200">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-800">
                <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{session.user.name}</span>
            <span className="text-xs text-gray-500 truncate">
              {session.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/profile`)}
          className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/favorite")}
          className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>Favorites</span>
        </DropdownMenuItem>

        {session?.user?.role === "admin" ? (
          <>
            <DropdownMenuItem
              onClick={() => router.push("admin/consultations")}
              className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
            >
              <Code className="mr-2 h-4 w-4" />
              <span>Consultation</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/admin")}
              className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Upload</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("admin/update")}
              className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Update</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push("/consultations/history")}
            className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
          >
            <Code className="mr-2 h-4 w-4" />
            <span>Consultation</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-red-500 hover:text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Tablet or smaller, hide the desktop navbar
        if (navbarRef.current) navbarRef.current.style.display = "none";
        if (mobileNavRef.current) mobileNavRef.current.style.display = "block";
      } else {
        // Larger than tablet, show the desktop navbar
        if (navbarRef.current) navbarRef.current.style.display = "flex";
        if (mobileNavRef.current) mobileNavRef.current.style.display = "none";
      }
    };

    // Attach event listener on component mount
    window.addEventListener("resize", handleResize);
    handleResize(); // Run once to set the initial state

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <div
        ref={navbarRef}
        className="flex flex-col z-[9999] fixed border dark:border-darkBg border-lightBg shadow-lg w-full -mt-1"
      >
        <div className="w-full py-2 flex justify-center items-center text-white text-[9px] lg:text-[12px] backdrop-blur-md bg-gradient-moving bg-[length:200%_200%] animate-gradient-x">
          <span className="mr-2 font-semibold">Introducing</span>

          <p className="ml-1">
            - Free & consultations source codes for all your development needs!
          </p>
        </div>
        <div className="flex justify-between items-center w-full px-4 md:px-8 lg:px-20 py-3 bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText">
          <div className="flex items-center">
            <Link
              href={"/"}
              aria-label="Homepage"
              className="flex items-center group"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="w-8 h-8 md:w-10 md:h-10 group-hover:text-red-500 transition-colors duration-300"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>

            <div className="hidden md:flex items-center ml-10 space-x-8">
              <Link
                href="/"
                className="text-sm font-medium hover:text-red-500 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium hover:text-red-500 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Source Codes
              </Link>
              <Link
                href="/favorite"
                className="text-sm font-medium hover:text-red-500 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Favorites
              </Link>
              {session && (
                <Link
                  href="/consultations/history"
                  className="text-sm font-medium hover:text-red-500 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full"
                >
                  Consultation
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ProfileButton />
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div ref={mobileNavRef}>
        <BottomBar />
      </div>
    </>
  );
};

export default Navbar;
