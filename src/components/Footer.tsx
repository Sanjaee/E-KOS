import React from 'react';
import Link from 'next/link';
import { Building2, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">E-Kos</h3>
                <p className="text-xs text-gray-400">Cari Kos Impian</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform terpercaya untuk menemukan kamar kos impian Anda. 
              Ribuan pilihan dengan fasilitas lengkap dan harga terjangkau.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-blue-400 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tentang E-Kos</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm hover:text-blue-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-sm hover:text-blue-400 transition-colors">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-sm hover:text-blue-400 transition-colors">
                  Mitra E-Kos
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-sm hover:text-blue-400 transition-colors">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/help" className="text-sm hover:text-blue-400 transition-colors">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-blue-400 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/payment" className="text-sm hover:text-blue-400 transition-colors">
                  Cara Pembayaran
                </Link>
              </li>
              <li>
                <Link href="/complaint" className="text-sm hover:text-blue-400 transition-colors">
                  Laporan & Keluhan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">
                    Jl. Contoh No. 123<br />
                    Jakarta Selatan, 12345<br />
                    Indonesia
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+628123456789" className="text-sm hover:text-blue-400 transition-colors">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@ekos.com" className="text-sm hover:text-blue-400 transition-colors">
                  info@ekos.com
                </a>
              </li>
            </ul>

            {/* App Download */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-3">Download Aplikasi</p>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">Download on the</p>
                    <p className="text-xs font-semibold text-white">App Store</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">GET IT ON</p>
                    <p className="text-xs font-semibold text-white">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} E-Kos. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                Syarat & Ketentuan
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors">
                Kebijakan Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

