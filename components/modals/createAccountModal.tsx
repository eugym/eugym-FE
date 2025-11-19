"use client";

import { ArrowRight, CircleUser, Users } from "lucide-react";
import Modal from "./modal";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const link = "https://forms.gle/vpvqG2h8sun2mAp97";
export default function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      widthClass="max-w-md"
    >
      <div
        // onClick={onClose}
        className="bg-[#27c55b] rounded-t-2xl -mt-5 -mx-5 px-5 py-4 flex justify-between items-center text-white"
      >
        <div className="flex -space-x-2">
          {/* <Image
            src="/avatars/avatar1.png"
            // alt="avatar"
            width={32}
            height={32}
            className="rounded-full border-1 border-white"
          /> */}
        </div>
        <button onClick={onClose} className="text-sm font-medium  ">
          Close
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">Create Account</h2>
        <p className="text-gray-500 text-sm mb-4">Choose Your Account Type:</p>
        <a href={link}>
          <button className="w-full flex justify-between items-center p-4 border rounded-xl mb-3 hover:bg-gray-50 transition ">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <CircleUser width={20} height={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">
                  Sign up as an Individual
                </p>
                <p className="text-sm text-gray-500">
                  Start learning and advance your career.
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-gray-400" />
          </button>
        </a>
        <a href={link}>
          <button className="w-full flex justify-between items-center p-4 border rounded-xl mb-3 hover:bg-gray-50 transition">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Users width={20} height={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">
                  Sign up as a Company
                </p>
                <p className="text-sm text-gray-500">
                  Manage staff fitness program.
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-gray-400" />
          </button>
        </a>
      </div>
    </Modal>
  );
}
