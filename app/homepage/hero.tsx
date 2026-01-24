"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import HeroImg from "@/public/images/heroImg.png";
import CreateAccountModal from "@/components/modals/createAccountModal";
import { useState } from "react";
import HeroSlider from "@/components/carousel/slidder";
import ScrollIndicator from "@/components/animations/scrollIndicator";

// const googleFormLink = "https://forms.gle/vpvqG2h8sun2mAp97";
const HERO_IMAGES = [HeroImg, HeroImg, HeroImg];
const images = [HeroImg, HeroImg, HeroImg];
export default function Hero() {
  const [open, setOpen] = useState(false);

  // const registrationLink = (url: string) => {
  //   window.open(url, "_blank");
  // };
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-5 items-center ">
        <div className="hidden md:block mx-auto px-4 md:px-6 py-16 md:py-24 ">
          <motion.div
            className="space-y-6 text-center md:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight font-robot">
              Access Nigeria’s <br className="hidden sm:block" /> Largest
              Fitness <br className="hidden sm:block" /> Network
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-md mx-auto md:mx-0">
              Join 50,000+ Nigerians who have unlimited access to premium gyms,
              expert personal trainers, and exclusive hotel fitness facilities
              nationwide.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              <Button
                onClick={() => setOpen(true)}
                // onClick={() => registrationLink(googleFormLink)}
                variant="primary"
                className="w-[20rem]"
              >
                Join For Free
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="">
          <motion.div
            className=" flex justify-center  md:max-w-[700px] w-full  md:justify-end h-full "
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <HeroSlider />
          </motion.div>
          <div className="sm:hidden block">
            <ScrollIndicator />
          </div>
        </div>
      </section>
      <CreateAccountModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
