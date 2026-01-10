"use client";

import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function LoginForm() {
  const { mutateAsync: login, isPending: pending } = useLogin();
  const router = useRouter();

  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token");
  const [form, setForm] = useState({
    email: "",
    password: "",
    token: urlToken,
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form);
      toast.success("Login successful");
      router.push("/dashboard/stats");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.error?.message ?? "Login failed");
      }
    }
  };

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
          <h1 className="text-3xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Sign in with your email address and password.
          </p>
        </motion.div>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-md shadow-sm border border-gray-200 bg-gray-50 rounded-xl p-6"
        >
          <h2 className="text-gray-800 font-medium mb-4">Account Details</h2>

          {/* INPUTS APPEARING ONE BY ONE */}
          <div className="space-y-4">
            <form onSubmit={onSubmit} className="flex flex-col gap-3 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <InputField
                  label="Email Address"
                  placeholder="example@gmail.com"
                  type="email"
                  value={form?.email}
                  onChange={(val) => handleChange("email", val)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <InputField
                  label="Password"
                  type="password"
                  value={form?.password}
                  onChange={(val) => handleChange("password", val)}
                />
              </motion.div>

              <Button type="submit" className="w-full" loading={pending}>
                Login
              </Button>
            </form>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="mt-4 text-sm text-gray-500 flex justify-self-center"
          >
            Forgot Password?
            <Link
              href="/auth/reset-password"
              className="text-gray-900 font-medium hover:underline mx-2"
            >
              Reset it here
            </Link>
          </motion.div>
        </motion.div>

        {/* BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="w-full max-w-md mt-8"
        ></motion.div>

        {/* SIGN UP */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.4 }}
          className="mt-2 text-sm text-gray-700 "
        >
          Don’t have an account?{" "}
          <Link
            href="/auth/user_register"
            className="text-primary-lite hover:underline"
          >
            Sign Up
          </Link>
        </motion.span>
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
