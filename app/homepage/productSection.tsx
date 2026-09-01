"use client";

import ProductCard from "@/components/cards/ProductCard";
import product1 from "@/public/images/product1.jpg";
import product2 from "@/public/images/product2.jpg";
import product3 from "@/public/images/Sport Bra.jpg";
import product4 from "@/public/images/Joggers.png";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

const products = [
  {
    name: "Sport Bra",
    price: "₦18,000",
    image: product3,
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
    image: product4,
  },
];

export default function ProductSection() {
  return (
    <section className="bg-(--plate-surface) py-20" id="store">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2
          className="display text-3xl md:text-4xl lg:text-5xl mb-4"
        >
          Explore Our{" "}
          {/* --plate-green: the same fill as the primary button, matching the
              hero headline accent and "Trainers" in the trainers section. */}
          <span className="text-(--plate-green)">Gym and Shop</span>{" "}
          <br className="hidden md:block" />
          High-quality Equipment
        </h2>
        <p className="mx-auto mb-12 max-w-[60ch] text-sm text-(--plate-steel) md:text-base">
          Transform Your Training with Our Premium Fitness Equipment – Built for
          Every Goal, Every Body.
        </p>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>

        <Button
          variant="primary"
          onClick={() => toast.error("Store not available at this time")}
          className="min-w-[14rem]"
        >
          See All Products
        </Button>
      </div>
    </section>
  );
}
