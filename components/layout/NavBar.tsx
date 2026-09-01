"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import Eugymlogo from "@/public/asset/eugym_logo.png";
import Image from "next/image";
import CreateAccountModal from "../modals/createAccountModal";

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
      <a href="#">
        <Image
          src={Eugymlogo}
          alt="logo"
          className="md:w-16 md:h-16 h-12 w-12 p-1"
        />
      </a>
    </div>
  ),
  navLinks,

  primaryAction = { label: "Login", href: "auth/login" },
  secondaryAction = {
    label: "Sign-up",
    href: "https://forms.gle/vpvqG2h8sun2mAp97",
  },
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-(--plate-surface) md:px-12">
        <nav className="flex items-center justify-between px-4 py-2 md:px-10">
          {logo}
          {/* Desktop Links — the active item is marked by a solid plate bar
              beneath it, not a colour change alone. */}
          <ul className="hidden items-center gap-8 text-sm font-medium text-(--plate-steel) md:flex">
            {navLinks.map(({ name, href }) => {
              const isActive = pathname === href;
              return (
                <li key={name}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative block py-1.5 transition-colors duration-150 hover:text-(--plate-iron) ${
                      isActive ? "text-(--plate-iron) font-semibold" : ""
                    }`}
                  >
                    {name}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-0 h-[3px] w-full bg-(--plate-green)" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={primaryAction.href}
              className="rounded-(--plate-radius) border border-(--plate-rule) px-5 py-2 text-sm font-semibold text-(--plate-iron) transition-colors hover:border-(--plate-iron)"
            >
              {primaryAction.label}
            </Link>
            <button
              onClick={() => setOpenModal(true)}
              className="rounded-(--plate-radius) border border-(--plate-green-deep) bg-(--plate-green) px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-(--plate-green-deep) active:translate-y-px"
            >
              {secondaryAction.label}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="text-2xl text-(--plate-iron) focus:outline-none md:hidden"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </nav>
        {/* Knurl seam: the milled edge where the header meets the page. */}
        <div className="knurl h-[3px] w-full" aria-hidden="true" />

        {/* Mobile Dropdown */}

        <motion.div
          className={`md:hidden shadow-md overflow-hidden fixed inset-0 bg-black/70 transition-opacity z-40 ${
            isOpen ? "block" : "hidden"
          }`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(false)}
        >
          <ul className="flex flex-col gap-1 bg-(--plate-surface) p-6 font-medium text-(--plate-steel)">
            {navLinks.map(({ name, href }) => {
              const isActive = pathname === href;
              return (
                <li key={name}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 py-2.5 transition-colors duration-150 ${
                      isActive
                        ? "font-semibold text-(--plate-iron)"
                        : "hover:text-(--plate-iron)"
                    }`}
                  >
                    {/* Plate marker: present but blank when inactive, so rows
                        stay aligned and colour never carries meaning alone. */}
                    <span
                      aria-hidden="true"
                      className="h-5 w-1 shrink-0"
                      style={{
                        background: isActive
                          ? "var(--plate-green)"
                          : "var(--plate-rule)",
                      }}
                    />
                    {name}
                  </Link>
                </li>
              );
            })}
            <li className="mt-4">
              <Link
                href={primaryAction.href}
                className="block rounded-(--plate-radius) border border-(--plate-rule) py-2.5 text-center font-semibold text-(--plate-iron) hover:border-(--plate-iron)"
                onClick={() => setIsOpen(false)}
              >
                {primaryAction.label}
              </Link>
            </li>
            <li>
              <button
                className="block w-full rounded-(--plate-radius) border border-(--plate-green-deep) bg-(--plate-green) py-2.5 text-center font-semibold text-white hover:bg-(--plate-green-deep)"
                onClick={() => setOpenModal(true)}
              >
                {secondaryAction.label}
              </button>
            </li>
          </ul>
        </motion.div>
      </header>
      <CreateAccountModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
