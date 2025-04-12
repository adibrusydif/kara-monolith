'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-yellow-500">Kara Akademi Indonesia</h1>

          {/* Burger Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                // X icon when menu is open
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Burger icon when menu is closed
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-6 items-center">
            <Link href="/" className="text-black hover:text-yellow-500 font-medium">Home</Link>
            <Link href="#facilities" className="text-black hover:text-yellow-500 font-medium">Facilities</Link>
            <Link href="#services" className="text-black hover:text-yellow-500 font-medium">Services</Link>
            <Link href="#location" className="text-black hover:text-yellow-500 font-medium">Location</Link>
            <Link 
              href="/login" 
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 text-center font-semibold"
            >
              Login
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <nav 
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4 pb-4`}
        >
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-black hover:text-yellow-500 px-2 py-1 rounded font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="#facilities" 
              className="text-black hover:text-yellow-500 px-2 py-1 rounded font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Facilities
            </Link>
            <Link 
              href="#services" 
              className="text-black hover:text-yellow-500 px-2 py-1 rounded font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="#location" 
              className="text-black hover:text-yellow-500 px-2 py-1 rounded font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Location
            </Link>
            <Link 
              href="/login" 
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 text-center font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
} 