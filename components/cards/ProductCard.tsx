"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface ProductCardProps {
  name: string;
  price: string;
  image: string | StaticImport;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white border w-[20rem] border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center p-4 "
    >
      <div className="w-full h-56 relative mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-700 font-medium mt-1">{price}</p>
      <button className="mt-2 text-green-500 text-sm font-medium hover:text-green-600 transition">
        Add to Cart
      </button>
    </motion.div>
  );
};

export default ProductCard;
