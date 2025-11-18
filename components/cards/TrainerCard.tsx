"use client";

import { Star, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface TrainerCardProps {
  name: string;
  specialty: string;
  clients: number;
  experience: number;
  location: string;
  price: string;
  rating: number;
  image: string | StaticImport;
}

const TrainerCard: React.FC<TrainerCardProps> = ({
  name,
  specialty,
  clients,
  experience,
  location,
  price,
  rating,
  image,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={500}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white text-gray-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow">
          <Star className="w-4 h-4 text-yellow-500" />
          {rating}
        </div>
      </div>

      <div className="p-5 text-left">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600 mb-3">{specialty}</p>

        <div className="flex items-center text-gray-500 text-sm mb-2 gap-2">
          <Users className="w-4 h-4" />
          {clients} clients • {experience} years experience
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4 gap-2">
          <MapPin className="w-4 h-4" />
          {location}
        </div>

        <p className="font-semibold text-gray-900">{price}</p>
        <p className="text-sm text-gray-500">Per Session</p>
      </div>
    </motion.div>
  );
};

export default TrainerCard;
