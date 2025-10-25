import React from 'react';
import Image from 'next/image';
import { Sparkles, TrendingUp, Shield, Star } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Main Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Promo Spesial Akhir Tahun!</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Temukan
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {' '}Kos Impian{' '}
              </span>
              Anda Sekarang
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Ribuan pilihan kamar kos dengan fasilitas lengkap, harga terjangkau, 
              dan lokasi strategis. Cari, bandingkan, dan booking dengan mudah!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">500+</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Kamar Kos</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">1000+</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Penghuni</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <p className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-pink-400">4.9</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden md:block">
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"
                alt="Kamar Kos Modern"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Aman & Terpercaya</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Terverifikasi</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Rating Tinggi</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">4.9/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Pembayaran Aman</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">100% Terjamin</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Harga Terbaik</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Promo Menarik</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Kualitas Terjamin</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Terverifikasi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Fasilitas Lengkap</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Modern & Nyaman</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

