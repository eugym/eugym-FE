"use client";

import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Sets a new password from an emailed reset token.
 *
 * The reset email links here with ?token=… — this page previously ignored it
 * entirely and its submit handler was empty, so every reset link was a dead
 * end no matter how well the backend worked.
 *
 * useSearchParams needs a Suspense boundary or the production build fails
 * while prerendering, hence the split.
 */
export default function NewPassword() {
  return (
    <Suspense fallback={<Shell>{null}</Shell>}>
      <NewPasswordForm />
    </Suspense>
  );
}

function NewPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  // Set when the server rejects the token itself, which needs a different
  // remedy from a bad password — the user must request a fresh link.
  const [tokenDead, setTokenDead] = useState(false);

  const handleChange = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  function validate() {
    const next: Record<string, string> = {};

    // Matches the registration rules rather than the looser reset endpoint, so
    // a reset can't quietly produce a password that registration would reject.
    if (form.password.length < 8)
      next.password = "Use at least 8 characters.";
    else if (!/[A-Z]/.test(form.password))
      next.password = "Include at least one capital letter.";
    else if (!/[0-9]/.test(form.password))
      next.password = "Include at least one number.";

    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords don't match.";

    return next;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.message ?? "Couldn't reset your password.";
        // The backend returns 400 for a token that is unknown, already used,
        // or past its 15-minute window.
        if (res.status === 400) setTokenDead(true);
        else toast.error(message);
        return;
      }

      toast.success("Password updated — sign in with your new password.");
      router.push("/auth/login");
    } catch {
      toast.error("Can't reach the server. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token || tokenDead) {
    return (
      <Shell>
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm">
          <AlertTriangle
            className="mx-auto mb-3 h-8 w-8 text-amber-500"
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-gray-900">
            {token ? "This link has expired" : "This link is incomplete"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
            {token
              ? "Reset links last 15 minutes and can only be used once. Request a new one to continue."
              : "The reset link is missing its token. Open the link from your email directly, or request a new one."}
          </p>
          <Link
            href="/auth/reset-password"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-(--plate-green-deep) px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Request a new link
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-4 text-center"
      >
        <h1 className="text-3xl font-semibold text-gray-800">Change Password</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose a new password for your account.
        </p>
      </motion.div>

      <form onSubmit={onSubmit} className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
        >
          <div className="space-y-4">
            <InputField
              label="Password"
              type="password"
              value={form.password}
              error={errors.password}
              onChange={(val) => handleChange("password", val)}
            />
            <InputField
              label="Re-enter password"
              type="password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onChange={(val) => handleChange("confirmPassword", val)}
            />
          </div>

          <div className="mt-4 mb-8 flex flex-col gap-2 text-sm text-gray-500">
            <Rule ok={form.password.length >= 8}>
              At least 8 characters long
            </Rule>
            <Rule ok={/[A-Z]/.test(form.password)}>
              Contains a capital letter
            </Rule>
            <Rule ok={/[0-9]/.test(form.password)}>Contains a number</Rule>
          </div>

          <Button type="submit" className="w-full" loading={submitting}>
            Continue
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Need help?{" "}
            <Link href="/#" className="font-bold">
              Contact support
            </Link>
          </p>
        </motion.div>
      </form>
    </Shell>
  );
}

/** Requirements double as live feedback, so the rule that's failing is obvious. */
function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center">
      <CheckCircle
        size={15}
        className={`mr-2 ${ok ? "text-emerald-500" : "text-gray-300"}`}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex min-h-screen w-full flex-col overflow-hidden bg-white md:flex-row"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex w-full flex-col items-center justify-center px-5 py-10 md:w-1/2 md:px-10 lg:px-20"
      >
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

        {children}
      </motion.div>

      <div className="relative hidden w-1/2 md:block">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src={Img} alt="Workout" fill className="object-cover" priority />
        </motion.div>
      </div>
    </motion.div>
  );
}
