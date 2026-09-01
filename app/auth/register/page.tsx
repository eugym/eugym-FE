"use client";

import { useState } from "react";
import TabSwitcher from "@/components/tabs/tab";
import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRegister } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { parseAuthError } from "@/app/api/lib/authError";

/** Which tab owns each field, so a failed submit can jump back to it. */
const ACCOUNT_FIELDS = ["firstName", "lastName", "phone", "email"] as const;

export default function UserRegister() {
  const [activeTab, setActiveTab] = useState("Account");
  const { mutateAsync: register, isPending: loading } = useRegister();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear this field's error as soon as it is edited — an error that outlives
    // its cause reads as a broken form.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  /** Catch what we can before spending a request on it. */
  const validateAccount = () => {
    const found: Record<string, string> = {};
    if (form.firstName.trim().length < 2)
      found.firstName = "First name needs at least 2 characters";
    if (form.lastName.trim().length < 2)
      found.lastName = "Last name needs at least 2 characters";
    if (form.phone.replace(/\D/g, "").length < 10)
      found.phone = "Enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      found.email = "Enter a valid email address";
    return found;
  };

  const validatePassword = () => {
    const found: Record<string, string> = {};
    if (form.password.length < 8)
      found.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.password))
      found.password = "Password needs at least one capital letter";
    else if (!/[0-9]/.test(form.password))
      found.password = "Password needs at least one number";
    if (form.confirmPassword !== form.password)
      found.confirmPassword = "Passwords don't match";
    return found;
  };

  const onContinue = () => {
    const found = validateAccount();
    if (Object.keys(found).length) {
      setErrors(found);
      toast.error("Fix the highlighted fields to continue");
      return;
    }
    setErrors({});
    setActiveTab("Password");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Re-check the account tab too: the user can go back and edit it.
    const found = { ...validateAccount(), ...validatePassword() };
    if (Object.keys(found).length) {
      setErrors(found);
      const onAccountTab = ACCOUNT_FIELDS.some((f) => f in found);
      if (onAccountTab) setActiveTab("Account");
      toast.error("Fix the highlighted fields to continue");
      return;
    }

    setErrors({});

    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });
      toast.success("Welcome to Eugym");
      // Hard navigation so the browser sends the new auth_session cookie on a
      // fresh request, letting the dashboard Server Component see it immediately.
      window.location.href = "/dashboard/stats";
    } catch (err) {
      const { message, fieldErrors, code } = parseAuthError(err);

      // A duplicate email comes back as CONFLICT with no field map. Left alone it
      // toasts "An account with this email already exists" while the user is on
      // the Password tab, with no email field in sight — so attribute it here.
      const resolved =
        code === "CONFLICT" && !Object.keys(fieldErrors).length
          ? { email: message }
          : fieldErrors;

      setErrors(resolved);
      toast.error(message);

      // Point the user at the tab that actually holds the problem, otherwise the
      // message names a field that isn't on screen.
      if (ACCOUNT_FIELDS.some((f) => f in resolved)) setActiveTab("Account");
    }
  };

  return (
    // PAGE FADE-IN
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex min-h-screen w-full flex-col overflow-hidden bg-(--plate-ground) md:flex-row"
      >
        {/* LEFT FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center items-center w-full md:w-1/2 px-5 py-1 md:px-10 lg:px-20"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-1"
          >
            <Link href="/">
              <Image src={logo} alt="Eugym" width={150} />
            </Link>
          </motion.div>

          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6 "
          >
            <h1 className="stamped text-3xl font-bold">
              Welcome to Eugym
            </h1>
            <p className="text-sm text-(--plate-steel)">
              Please complete your registration.
            </p>
          </motion.div>

          {/* TABS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full mb-4 flex justify-center items-center"
          >
            <TabSwitcher
              tabs={["Account", "Password"]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </motion.div>

          {/* FORM BOX */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-md rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) p-6"
          >
            <form onSubmit={onSubmit}>
              {activeTab === "Account" ? (
                <>
                  {/* <form onSubmit={onSubmit} className="flex flex-col gap-3 space-y-5"></form>   */}
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-(--plate-steel)">
                    Account Details
                  </h2>

                  {/* INPUT GRID */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <InputField
                        label="First Name"
                        placeholder="Martins"
                        autoComplete="given-name"
                        value={form.firstName}
                        error={errors.firstName}
                        onChange={(val) => handleChange("firstName", val)}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <InputField
                        label="Last Name"
                        placeholder="Chinedu"
                        autoComplete="family-name"
                        value={form.lastName}
                        error={errors.lastName}
                        onChange={(val) => handleChange("lastName", val)}
                      />
                    </motion.div>
                  </div>

                  {/* OTHER INPUTS */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    {/* type="tel", not "number" — a number input drops the leading
                        zero that every Nigerian mobile number starts with. */}
                    <InputField
                      label="Phone Number"
                      placeholder="09055555332"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      error={errors.phone}
                      onChange={(val) => handleChange("phone", val)}
                    />

                    <InputField
                      label="Email Address"
                      placeholder="example@gmail.com"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      error={errors.email}
                      onChange={(val) => handleChange("email", val)}
                    />

                    <Button onClick={onContinue} className="w-full">
                      Continue
                    </Button>
                  </motion.div>

                  {/* HELP TEXT */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="mt-5 text-sm text-gray-500 flex justify-self-center"
                  >
                    Need Help?{" "}
                    <button className="text-gray-900 font-medium hover:underline mx-2">
                      Contact Support
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-(--plate-steel)">
                    Set Your Password
                  </h2>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <InputField
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        error={errors.password}
                        onChange={(val) => handleChange("password", val)}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <InputField
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        error={errors.confirmPassword}
                        onChange={(val) => handleChange("confirmPassword", val)}
                      />
                    </motion.div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      At least 8 characters, with one capital letter and one number.
                    </p>

                    <Button className="w-full" loading={loading} type="submit">
                      Create Account
                    </Button>
                  </div>
                </>
              )}
            </form>
          </motion.div>

          {/* SUBMIT BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="w-full max-w-md mt-6"
          ></motion.div>
          {/* LOGIN LINK */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-2 text-gray-700 text-sm"
          >
            Have an account?{" "}
            <Link
              href="/auth/login"
              className="text-(--plate-green-deep) hover:underline"
            >
              Login
            </Link>
          </motion.span>
        </motion.div>

        {/* RIGHT IMAGE SECTION WITH ZOOM ANIMATION */}
        <div className="hidden md:block w-1/2 relative">
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image src={Img} alt="Workout" fill className="object-cover" />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
