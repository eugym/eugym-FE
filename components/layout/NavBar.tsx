"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import navlogo from "@/public/asset/logo.png";
import Image from "next/image";

export interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  logo?: React.ReactNode;
  navLinks: NavLink[];
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

export default function Navbar({
  logo = (
    <div className="flex items-center space-x-2">
      <Image src={navlogo} alt="logo" className="md:w-16 md:h-12 h-12 w-12" />
    </div>
  ),
  navLinks,
  // primaryAction = { label: "Login", href: "/login" },
  // secondaryAction = { label: "Sign-up", href: "/registration" },
  primaryAction = { label: "Login", href: "/login" },
  secondaryAction = {
    label: "Sign-up",
    href: "https://forms.gle/vpvqG2h8sun2mAp97",
  },
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm w-full md:px-20">
      <nav className="flex justify-between items-center px-6 md:px-10 py-4">
        {/* Logo */}
        {logo}

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {navLinks.map(({ name, href }) => {
            const isActive = pathname === href;
            return (
              <motion.li
                key={name}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={href}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-green-600 font-semibold border-b-2 border-green-500 pb-1"
                      : "hover:text-green-500"
                  }`}
                >
                  {name}
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href={primaryAction.href}
            className="px-5 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition"
          >
            {primaryAction.label}
          </Link>
          <Link
            href={secondaryAction.href}
            className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            {secondaryAction.label}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <motion.div
        className={`md:hidden bg-white border-t shadow-md overflow-hidden ${
          isOpen ? "block" : "hidden"
        }`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ul className="flex flex-col space-y-4 p-6 text-gray-700 font-medium">
          {navLinks.map(({ name, href }) => {
            const isActive = pathname === href;
            return (
              <li key={name}>
                <Link
                  href={href}
                  target="_blank"
                  onClick={() => setIsOpen(false)}
                  className={`block transition-colors duration-200 ${
                    isActive
                      ? "text-green-600 font-semibold"
                      : "hover:text-green-500"
                  }`}
                >
                  {name}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href={primaryAction.href}
              className="block text-center border border-green-500 text-green-500 rounded-md py-2 hover:bg-green-50"
              onClick={() => setIsOpen(false)}
            >
              {primaryAction.label}
            </Link>
          </li>
          <li>
            <Link
              href={secondaryAction.href}
              className="block text-center bg-green-500 text-white rounded-md py-2 hover:bg-green-600"
              onClick={() => setIsOpen(false)}
              target="_blank"
            >
              {secondaryAction.label}
            </Link>
          </li>
        </ul>
      </motion.div>
    </header>
  );
}
