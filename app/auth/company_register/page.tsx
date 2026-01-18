"use client";

import { useState } from "react";
import TabSwitcher from "@/components/tabs/tab";
import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRegister } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ComapanyRegister() {
  const [activeTab, setActiveTab] = useState("Account");
  const [loading, setLoading] = useState(false);
  const register = useRegister();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    companyName: "",
    email: "",
    password: "",
    confrmPassword: "",
    role: "COMPANY",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register.mutateAsync(form);
      toast.success("Company Registration successful");
      router.push("/auth/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.error?.message ?? "Login failed");
      }
    }
    setLoading(false);
  };

  return (
    // PAGE FADE-IN
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row w-full overflow-hidden bg-white"
    >
      {/* LEFT FORM SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 px-5 py-10 md:px-10 lg:px-20"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-1"
        >
          <Link href="/">
            <Image src={logo} alt="Eugym" width={140} />
          </Link>
        </motion.div>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6 "
        >
          <h1 className="sm:text-3xl text-2xl font-semibold text-gray-800">
            Welcome to Eugym Fitness
          </h1>
          <p className="text-gray-500 text-sm">
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
          className="w-full max-w-md shadow-sm border border-gray-200 bg-gray-50 rounded-xl p-6 "
        >
          <form onSubmit={onSubmit}>
            {activeTab === "Account" ? (
              <>
                <h2 className="text-gray-800 font-medium mb-4">
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
                      placeholder="Maritns"
                      value={form?.firstName}
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
                      placeholder="Martins"
                      value={form?.lastName}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <InputField
                        label="Phone number"
                        placeholder="0903333333"
                        type="number"
                        value={form?.phoneNumber}
                        onChange={(val) => handleChange("phoneNumber", val)}
                      />{" "}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <InputField
                        label="Email Address"
                        placeholder="example@gmail.com"
                        type="email"
                        value={form?.email}
                        onChange={(val) => handleChange("email", val)}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    <InputField
                      label="Company"
                      placeholder="mitcrux limited"
                      type="company"
                      value={form?.companyName}
                      onChange={(val) => handleChange("companyName", val)}
                    />
                  </motion.div>

                  <Button
                    onClick={() => setActiveTab("Password")}
                    className="w-full"
                  >
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
                <h2 className="text-gray-800 font-medium mb-4">
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
                      value={form?.password}
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
                      value={form?.confrmPassword}
                      onChange={(val) => handleChange("confrmPassword", val)}
                    />
                  </motion.div>

                  <Button className="w-full" type="submit" loading={loading}>
                    Submit
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
          className="mt-4 text-gray-700 text-sm"
        >
          Have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary-lite hover:underline"
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
  );
}
