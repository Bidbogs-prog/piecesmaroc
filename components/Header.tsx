'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#0a1628]/95 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            PiecesMaroc
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-300 hover:text-emerald-400 transition">
              Home
            </Link>

            <Link href="/categories" className="text-slate-300 hover:text-emerald-400 transition">
              Categories
            </Link>

            <Link href="/about" className="text-slate-300 hover:text-emerald-400 transition">
              About
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-emerald-400 transition">
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/post-ad"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20"
            >
              Post Ad
            </Link>
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition px-4 py-2"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/10 pt-4">
            <Link
              href="/"
              className="block text-slate-300 hover:text-emerald-400 transition py-2"
            >
              Home
            </Link>

            <Link
              href="/categories"
              className="block text-slate-300 hover:text-emerald-400 transition py-2"
            >
              Categories
            </Link>

            <Link
              href="/about"
              className="block text-slate-300 hover:text-emerald-400 transition py-2"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-slate-300 hover:text-emerald-400 transition py-2"
            >
              Contact
            </Link>
            <Link
              href="/post-ad"
              className="block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all text-center font-medium shadow-lg shadow-emerald-500/20"
            >
              Post Ad
            </Link>
            <Link
              href="/login"
              className="block text-slate-300 hover:text-white transition py-2"
            >
              Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
