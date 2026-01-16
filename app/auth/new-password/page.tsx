"use client";

import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

const notify = () => toast.error("Unavailable at the moment");

export default function NewPassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  function onSubmit() {}

  return (
    // PAGE FADE IN
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden bg-white"
    >
      {/* LEFT SECTION – FORM */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 px-5 py-10 md:px-10 lg:px-20"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-1"
        >
          <Link href="/">
            <Image src={logo} alt="Eugym" width={200} />
          </Link>
        </motion.div>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-4"
        >
          <h1 className="text-3xl font-semibold text-gray-800">
            Change Password
          </h1>
        </motion.div>

        {/* FORM */}
        <form onSubmit={onSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-md shadow-sm border border-gray-200 bg-gray-50 rounded-xl p-6"
          >
            {/* INPUTS APPEARING ONE BY ONE */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <InputField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <InputField
                  label="RE-ENTER PASSWORD"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e)}
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="mt-4 text-sm text-gray-500 flex flex-col gap-2 mb-10"
            >
              <div className="flex  items-center">
                <CheckCircle size={15} className="text-emerald-400  mr-2" />{" "}
                Password should be at least 8 characters long.
              </div>
              <div className="flex  items-center">
                <CheckCircle size={15} className="text-emerald-400  mr-2" />{" "}
                Password requires special characters.
              </div>
            </motion.div>
            <div className="flex justify-self-center mx-2">
              Need Help?{" "}
              <Link href={"/#"} className="mx-2 font-bold">
                Contact Support{" "}
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="w-full max-w-md mt-5"
            >
              <Button onClick={notify} className="w-full" type="submit">
                Continue
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>

      {/* RIGHT SECTION – IMAGE (SLOW ZOOM-IN) */}
      <div className="hidden md:block w-1/2 relative">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={Img}
            alt="Workout"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
