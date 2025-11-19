"use client";

import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";
const notify = () => toast.error("unavailable at the momment");

export default function LoginForm() {
  return (
    <>
      <div className="flex sm:min-h-screen h-full">
        {/* <div className="absolute inset-0 lg:hidden">
          <Image
            src={Img}
            alt="Gym background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-white/90 " />
        </div> */}
        {/* Left Form Section */}
        <div className="opacity-99 flex flex-col justify-center items-center w-full md:w-1/2 md:p-8 p-2 lg:p-20  h-full py-1">
          {/* Logo */}
          <div className="mb-1">
            <Link href="/">
              <Image src={logo} alt="Eugym" width={200} />
            </Link>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-2">
            <h1 className="text-3xl  font-semibold text-gray-800 ">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in with your email address and password.
            </p>
          </div>

          {/* Form Box */}
          <div className="w-full max-w-md inset-shadow-2xs mt-3 rounded-xl shadow-sm p-6 border border-gray bg-gray/10">
            <>
              <h2 className="text-gray-800 font-medium mb-4">
                Account Details
              </h2>

              <div className="mt-4 space-y-4">
                <InputField
                  label="Email Address"
                  placeholder="example@gmail.com"
                  type="email"
                />
                <InputField label="Password" type="password" />
              </div>
              <div className="mt-5 text-sm text-gray-500">
                Forgot Password?{" "}
                <button className="text-gray-900 font-medium hover:underline">
                  Reset it here
                </button>
              </div>
            </>
          </div>

          <div className="w-full flex text-center max-w-sm mt-10">
            <Button onClick={notify} className="w-full justify-self-center">
              Continue
            </Button>
          </div>

          <span className="mt-4">
            don't have an account?{" "}
            <a
              href="/auth/registration"
              className="text-primary-lite hover:underline"
            >
              {" "}
              SignUp
            </a>
          </span>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex w-1/2 bg-gray-100 relative">
          <Image src={Img} alt="Workout" fill className="object-cover" />
        </div>
      </div>
    </>
  );
}
