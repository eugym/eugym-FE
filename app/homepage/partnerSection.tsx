"use client";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function PartnerSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6"
        >
          Partner with Nigeria’s Largest Fitness Access Network
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-gray-600 leading-relaxed text-sm md:text-base mb-8"
        >
          Eugym makes your hotel gym a destination for fitness travelers
          nationwide. As an affiliate partner, you’ll host verified Eugym
          members whenever they travel—driving consistent usage of your
          facilities, enhancing guest satisfaction, and boosting your brand
          visibility.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          onClick={() => toast.error("Not available at this time")}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-md transition"
        >
          Become an Affiliate
        </motion.button>
      </div>
    </section>
  );
}
