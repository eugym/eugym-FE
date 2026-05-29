"use client";

import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import Modal from "@/components/modals/modal";
import OtpInput from "../components/otp-input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/useAuth";
export default function ResetPassword() {
  // const [openModal, setOpenModal] = useState(true);

  const router = useRouter();
  const { mutateAsync: Forgot, isPending: loading } = useForgotPassword();

  const [form, setForm] = useState({
    email: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await Forgot(form);
      toast.success("Password reset link sent to your email");
      router.push("auth/login");
    } catch (err: any) {
      const msg =
        err?.error?.message ??
        err?.message ??
        "Unable to send reset link";
      toast.error(msg);
    }
  };

  return (
    <>
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
          className="flex flex-col justify-center items-center w-full md:w-1/2 px-5 py-10 md:px-10 lg:px-20 "
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
              Reset Password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter the email associated with your account
            </p>
          </motion.div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="w-full  flex justify-center">
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
                    label="Email"
                    placeholder="example@gail.com"
                    value={form?.email}
                    onChange={(val) => handleChange("email", val)}
                  />
                </motion.div>
              </div>
              <div className="mt-10">
                <Button type="submit" className="w-full" loading={loading}>
                  Continue
                </Button>
              </div>
            </motion.div>
          </form>
          {/* BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="w-full max-w-md mt-8"
          >
            {/* <Button
              onClick={() => onSubmit}
              className="w-full"
              loading={loading}
            >
              Continue
            </Button> */}
          </motion.div>

          {/* SIGN UP */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="mt-4 text-sm text-gray-700"
          >
            <Link
              href="/auth/login"
              // className="text-primary-lite hover:underline mt-1 font-bold"
            >
              Go Back to
              <span className="text-primary-lite hover:underline font-bold mx-2">
                Sign In
              </span>
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

      {/* <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div className="flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-1"
          >
            <Image src={logo} alt="Eugym" width={100} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-4"
          >
            <h1 className="text-2xl font-semibold text-gray-800 w-[80%] flex justify-center justify-self-center text-center ">
              A password reset code has been sent to your email.
            </h1>
            <p className="text-gray-500 text-sm mt-5">
              Please enter code here to create new password.
            </p>
            <div className="my-10">
              <OtpInput value={otp} onChange={setOtp} />
            </div>
            <div className="text-primary hover:underline hover:cursor-pointer">
              resend code
            </div>
          </motion.div>
        </div>
      </Modal> */}
    </>
  );
}
