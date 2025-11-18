"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string; // e.g., "max-w-md", "max-w-lg"
  showHeader?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  widthClass = "max-w-md",
  showHeader = true,
}: ModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm "
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className={`fixed z-50 inset-0 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm`}
          >
            <div
              className={`relative w-full ${widthClass} bg-white rounded-2xl shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {showHeader && (
                <div className="flex justify-between items-center border-b px-5 py-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-5">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
