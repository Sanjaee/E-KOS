import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, Heart, Bell, Menu, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-4">
              <span>📱 Download App</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">🎉 Promo Spesial Bulan Ini!</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/about" className="hover:underline hidden sm:inline">
                Tentang Kami
              </Link>
              <span className="hidden sm:inline">|</span>
              <Link href="/help" className="hover:underline">
                Bantuan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                E-Kos
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                Cari Kos Impian
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari kamar kos berdasarkan lokasi, fasilitas, harga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Button
                size="sm"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                Cari
              </Button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 dark:text-gray-400"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hidden sm:flex"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hidden sm:flex"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </Button>

            {/* User Menu */}
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Masuk</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 dark:text-gray-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari kamar kos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Category Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-3 overflow-x-auto scrollbar-hide text-sm">
            <Link href="/" className="whitespace-nowrap text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">
              Semua Kamar
            </Link>
            <Link href="/promo" className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              🔥 Promo
            </Link>
            <Link href="/new" className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              ✨ Terbaru
            </Link>
            <Link href="/premium" className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              ⭐ Premium
            </Link>
            <Link href="/budget" className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              💰 Budget Friendly
            </Link>
            <Link href="/nearby" className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              📍 Terdekat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
