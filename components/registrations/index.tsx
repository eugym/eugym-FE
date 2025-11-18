"use client";

import { useState } from "react";
import TabSwitcher from "../tabs/tab";
import InputField from "../inputs/input";
import Image from "next/image";
import Img from "@/public/images/fitImg.png";
import logo from "@/public/asset/logo.png";
import Button from "../ui/Button";

import toast from "react-hot-toast";
const notify = () => toast.error("unavailable at the momment");

export default function RegistrationForm() {
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <div className="flex sm:min-h-screen h-full bg-gray ">
      <div className="absolute inset-0 lg:hidden">
        <Image
          src={Img}
          alt="Gym background"
          fill
          className="object-cover opacity-99"
        />

        <div className="absolute inset-0 bg-gray/95" />
      </div>
      {/* Left Form Section */}

      <div className="opacity-99 flex flex-col justify-center items-center w-full h-screen md:w-1/2 md:p-8 p-2 lg:p-20  ">
        {/* Logo */}
        <div className="mb-2">
          <Image src={logo} alt="Eugym" width={120} height={50} />
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome to Eugym
          </h1>
          <p className="text-gray-500 text-sm">
            Please complete your registration.
          </p>
        </div>

        {/* Tabs */}
        <TabSwitcher
          tabs={["Account", "Password"]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Form Box */}
        <div className=" w-full max-w-md inset-shadow-2xs mt-6 rounded-xl shadow-sm p-6 bg-black/10">
          {activeTab === "Account" ? (
            <>
              <h2 className="text-gray-800 font-medium mb-4">
                Account Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
                <InputField label="First Name" placeholder="Barka" />
                <InputField label="Last Name" placeholder="Balami" />
              </div>
              <div className="space-y-4">
                <InputField
                  label="Email Address"
                  placeholder="example@gmail.com"
                  type="email"
                />
                <InputField label="Company" placeholder="Meta" />
              </div>
              <div className="mt-3 text-sm text-gray-500">
                Need Help?{" "}
                <button className="text-gray-900 font-medium hover:underline">
                  Contact Support
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-gray-800 font-medium mb-4">
                Set Your Password
              </h2>
              <div className="space-y-4">
                <InputField label="Password" type="password" />
                <InputField label="Confirm Password" type="password" />
              </div>
            </>
          )}
        </div>
        <span className="mt-4">
          have an account?{" "}
          <a href="/login" className="text-primary-lite hover:underline">
            {" "}
            Login
          </a>
        </span>

        <div className="w-full flex text-center max-w-sm md:mt-5 mt-10 ">
          <Button onClick={notify} className="w-full justify-self-center ">
            Continue
          </Button>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex w-1/2  relative ">
        <Image src={Img} alt="Workout" fill className="object-cover" />
      </div>
    </div>
  );
}
