"use client";

import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Suspense, useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useSearchParams } from "next/navigation";
import { parseAuthError } from "@/app/api/lib/authError";

export default function LoginForm() {
  const { mutateAsync: login, isPending: pending } = useLogin();

  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token");
  const [form, setForm] = useState({
    email: "",
    password: "",
    token: urlToken,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  // Failures that belong to the whole form rather than one field — a wrong
  // password implicates neither input on its own.
  const [formError, setFormError] = useState("");

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      found.email = "Enter a valid email address";
    if (!form.password) found.password = "Enter your password";

    if (Object.keys(found).length) {
      setErrors(found);
      setFormError("");
      toast.error("Fix the highlighted fields to continue");
      return;
    }

    setErrors({});
    setFormError("");

    try {
      await login(form);
      toast.success("Welcome back");
      // Hard navigation ensures the browser sends the new auth_session cookie in a
      // fresh HTTP request, so the dashboard Server Component sees it on first load.
      window.location.href = "/dashboard/stats";
    } catch (err) {
      const { message, fieldErrors } = parseAuthError(err);
      setErrors(fieldErrors);

      // Anything without a field map — bad credentials, a locked account, the API
      // being down — is a statement about the attempt, not about one input.
      if (!Object.keys(fieldErrors).length) setFormError(message);

      toast.error(message);
    }
  };

  return (
    // PAGE FADE IN
    <Suspense fallback={<div>Loading...</div>}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex min-h-screen w-full flex-col overflow-hidden bg-(--plate-ground) md:flex-row"
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
            <h1 className="stamped text-3xl font-bold">Welcome Back</h1>
            <p className="text-sm text-(--plate-steel)">
              Sign in with your email address and password.
            </p>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-md rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) p-6"
          >
            {/* Knurl seam along the panel's top edge — the milled grip. */}
            <div className="knurl -mx-6 -mt-6 mb-5 h-[3px]" aria-hidden="true" />
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-(--plate-steel)">
              Account Details
            </h2>

            {/* Form-level failure. role="alert" so it is announced the moment it
                appears, not only when the field is next focused. */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5"
              >
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-600"
                  aria-hidden="true"
                />
                <p className="text-sm text-red-800 leading-snug">{formError}</p>
              </motion.div>
            )}

            {/* INPUTS APPEARING ONE BY ONE */}
            <div className="space-y-4">
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-3 space-y-5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <InputField
                    label="Email Address"
                    placeholder="example@gmail.com"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    error={errors.email}
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
                    autoComplete="current-password"
                    value={form.password}
                    error={errors.password}
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
              href="/auth/register"
              className="text-(--plate-green-deep) hover:underline"
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
    </Suspense>
  );
}
