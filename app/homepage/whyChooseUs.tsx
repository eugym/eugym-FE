"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, BadgeCheck, Clock } from "lucide-react";
import imageIcon1 from "@/public/asset/location.png";
import imageIcon2 from "@/public/asset/dumBell.png";
import imageIcon3 from "@/public/asset/lightFire.png";

const featuresTop = [
  {
    icon: imageIcon1,
    title: "Nationwide Access",
    description:
      "200+ premium gyms across Nigeria - from Lagos to Abuja, Kano to Port Harcourt...",
  },
  {
    icon: imageIcon2,
    title: "Personal Training",
    description:
      "Certified trainers for 1-on-1 sessions, custom workout plans, and nutrition guidance.",
  },
  {
    icon: imageIcon3,
    title: "Our Affiliates",
    description:
      "Exclusive access to luxury hotel fitness centers - Sheraton, Transcorp, Eko Hotels.",
  },
];

const featuresBottom = [
  {
    icon: <Leaf className="w-6 h-6 text-white" />,
    title: "Instant Access",
    description: "QR code entry to any partner gym",
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-white" />,
    title: "Premium Quality",
    description: "Only verified, high-standard facilities",
  },
  {
    icon: <Clock className="w-6 h-6 text-white" />,
    title: "24/7 Support",
    description: "Always available customer service",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="py-20 bg-white text-center">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-secondary mb-4"
        >
          Why Choose <span className="text-primary">Eugym?</span>
        </motion.h2>
        <p className="text-gray-500  mx-auto mb-12 max-w-92">
          Nigeria&apos;s most comprehensive fitness ecosystem designed for your
          active lifestyle
        </p>

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {featuresTop.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border-[0.1] border-accent rounded-xl shadow-xl hover:shadow-md p-6 text-center transition min-h-[13rem]"
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={32}
                height={32}
                className="w-12 h-12 mb-3 object-contain justify-self-center"
              />
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresBottom.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 bg-green-50 border border-green-100 rounded-xl p-5"
            >
              <div className="bg-primary p-2 rounded-md">{item.icon}</div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800 text-sm md:text-base">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
