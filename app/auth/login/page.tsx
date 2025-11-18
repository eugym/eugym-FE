"use client";

import InputField from "@/components/inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "@/components/ui/Button";

import toast from "react-hot-toast";
const notify = () => toast.error("unavailable at the momment");

export default function LoginForm() {
  return (
    <>
      <div className="flex sm:min-h-screen h-full bg-gray">
        <div className="absolute inset-0 lg:hidden">
          <Image
            src={Img}
            alt="Gym background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gray/80" />
        </div>
        {/* Left Form Section */}
        <div className="opacity-99 flex flex-col justify-center items-center w-full md:w-1/2 md:p-8 p-2 lg:p-20 h-screen">
          {/* Logo */}
          <div className="mb-6">
            <Image src={logo} alt="Eugym" width={120} height={50} />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in with your email address and passwordion.
            </p>
          </div>

          {/* Form Box */}
          <div className="w-full max-w-md inset-shadow-2xs mt-6 rounded-xl shadow-sm p-6 bg-black/10">
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
              <div className="mt-3 text-sm text-gray-500">
                Need Help?{" "}
                <button className="text-gray-900 font-medium hover:underline">
                  Contact Support
                </button>
              </div>
            </>
          </div>
          <span className="mt-4">
            don't have an account?{" "}
            <a
              href="/registration"
              className="text-primary-lite hover:underline"
            >
              {" "}
              SignUp
            </a>
          </span>
          <div className="w-full flex text-center max-w-sm mt-10">
            <Button onClick={notify} className="w-full justify-self-center">
              Continue
            </Button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex w-1/2 bg-gray-100 relative">
          <Image src={Img} alt="Workout" fill className="object-cover" />
        </div>
      </div>
    </>
  );
}
