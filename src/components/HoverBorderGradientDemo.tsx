"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function HoverBorderGradientDemo() {
  const { data: session, status } = useSession();
  return (
    <div className="mt-4 md:mt-10  flex justify-start ">
      <Link
        href="/blog"
        className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-white backdrop-blur-lg px-5 py-2 text-base dark:text-darkBg font-semibold text-shadow-gray-600/50 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl shadow-gray-600/50 border-2 border-gray-800/20"
      >
        <span className="text-[14px] ">Get Started</span>
        <FiArrowRight className="ml-2" />
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
          <div className="relative h-full w-10 bg-black/20"></div>
        </div>
      </Link>

      {session?.user?.role === "admin" ? (
        <Link
          href="/admin/consultations"
          className="group/button ml-5 relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800 backdrop-blur-lg px-5 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20"
        >
          <span className="text-[14px]">Consultation</span>
          <FiArrowRight className="ml-2 text-lg" />
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
            <div className="relative h-full w-10 bg-white/20"></div>
          </div>
        </Link>
      ) : (
        <Link
          href="/consultations"
          className="group/button ml-5 relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800 backdrop-blur-lg px-5 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20"
        >
          <span className="text-[14px]">Consultation</span>
          <FiArrowRight className="ml-2 text-lg" />
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
            <div className="relative h-full w-10 bg-white/20"></div>
          </div>
        </Link>
      )}
    </div>
  );
}
