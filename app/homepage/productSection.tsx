"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import product1 from "@/public/images/product1.jpg";
import product2 from "@/public/images/product2.jpg";
import toast from "react-hot-toast";

const products = [
  {
    name: "Sport Bra",
    price: "₦18,000",
    image: product1,
  },
  {
    name: "Performance Suit",
    price: "₦18,000",
    image: product2,
  },
  {
    name: "Sport Shorts",
    price: "₦18,000",
    image: product1,
  },
  {
    name: "Joggers",
    price: "₦18,000",
    image: product2,
  },
];

export default function ProductSection() {
  return (
    <section className="py-20 bg-white" id="store">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Explore Our Gym and Shop <br className="hidden md:block" />
          High-quality Equipment
        </motion.h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-12 text-sm md:text-base">
          Transform Your Training with Our Premium Fitness Equipment – Built for
          Every Goal, Every Body.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-20 gap-6 place-items-center mb-12 ">
          {products?.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>

        <motion.button
          onClick={() => toast.error("Not available at this time")}
          whileHover={{ scale: 1.05 }}
          className="bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-green-600 transition"
        >
          See All Products
        </motion.button>
      </div>
    </section>
  );
}
