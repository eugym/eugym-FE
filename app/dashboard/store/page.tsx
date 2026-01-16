"use client";
import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import sportBra from "@/public/images/Sport Bra.jpg";
import joggers from "@/public/images/joggers.jpg";
// Types
type Product = {
  id: number;
  name: string;
  price: string;
  image: string | StaticImageData;
};

// Sample product data (replace with API or props later)
const products: Product[] = [
  {
    id: 1,
    name: "Sport Bra",
    price: "₦8,000",
    image: sportBra,
  },
  {
    id: 2,
    name: "Performance Suit",
    price: "₦15,000",
    image: joggers,
  },
  {
    id: 3,
    name: "Sport Shorts",
    price: "₦7,500",
    image: sportBra,
  },
  {
    id: 4,
    name: "Joggers",
    price: "₦12,500",
    image: joggers,
  },
];

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-6">
        <h1 className="sm:text-3xl text-xl font-semibold sm:mb-6 mb-2">
          Store
        </h1>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-xl p-2 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="w-full h-40 relative bg-accent">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className=""
                />
              </div>
              <h3 className="mt-1  font-semibold">{product.name}</h3>
              <p className="text-green-600 font-medium">{product.price}</p>
              <button className="mt-2 text-green-700 p-2">Add to Cart</button>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <div className="w-full h-52 relative mb-4">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className=""
              />
            </div>

            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-green-600 text-lg font-semibold mb-4">
              {selectedProduct.price}
            </p>

            <button className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
