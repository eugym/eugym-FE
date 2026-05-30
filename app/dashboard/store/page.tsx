"use client";

import { useState, useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import {
  Search, ShoppingCart, X, Plus, Minus, Star, Truck,
  CreditCard, Building2, MapPin, Phone, User, Mail,
  CheckCircle, Package, ChevronRight, Heart, Tag,
} from "lucide-react";
import { useDashboardUser } from "../components/DashboardContext";

import sportBra   from "@/public/images/Sport Bra.jpg";
import joggers    from "@/public/images/joggers.jpg";
import joggersAlt from "@/public/images/Joggers.png";
import product1   from "@/public/images/product1.jpg";
import product2   from "@/public/images/product2.jpg";
import gymEquip   from "@/public/images/gymEquipments.jpg";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Category = "All" | "Apparel" | "Equipment" | "Accessories" | "Nutrition";

interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  image: StaticImageData;
  description: string;
  sizes?: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: "New" | "Sale" | "Hot";
}

interface CartItem {
  product: Product;
  size?: string;
  color: string;
  qty: number;
}

interface DeliveryInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

type PaymentMethod = "card" | "transfer" | "pod";
type CheckoutStep = "delivery" | "payment" | "confirmation";

// ─────────────────────────────────────────────
// Dummy data
// ─────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "p1", name: "Sport Bra", category: "Apparel", price: 8000, originalPrice: 10500,
    image: sportBra, badge: "Sale",
    description: "High-support sport bra with moisture-wicking fabric. Ideal for high-intensity workouts, running, and gym sessions. Features a racerback design for maximum range of motion.",
    sizes: ["XS","S","M","L","XL"], colors: ["Black","Rose","Navy"],
    stock: 24, rating: 4.5, reviewCount: 38,
  },
  {
    id: "p2", name: "Joggers", category: "Apparel", price: 12500,
    image: joggers,
    description: "Lightweight, tapered joggers with deep side pockets and an adjustable drawstring waist. Perfect for training, recovery walks, or casual wear.",
    sizes: ["S","M","L","XL","XXL"], colors: ["Charcoal","Olive","Black"],
    stock: 18, rating: 4.3, reviewCount: 22, badge: "New",
  },
  {
    id: "p3", name: "Performance Suit", category: "Apparel", price: 15000, originalPrice: 19500,
    image: joggersAlt, badge: "Sale",
    description: "Two-piece performance set with compression fit. The matching jacket and tights are crafted from 4-way stretch fabric for unrestricted movement.",
    sizes: ["XS","S","M","L","XL"], colors: ["Black","Royal Blue"],
    stock: 10, rating: 4.7, reviewCount: 15,
  },
  {
    id: "p4", name: "Sport Shorts", category: "Apparel", price: 7500,
    image: sportBra,
    description: "Ultra-breathable mesh shorts with built-in liner and zip pocket. Cut for agility — great for HIIT, cycling, or the gym floor.",
    sizes: ["S","M","L","XL"], colors: ["Black","Grey","White"],
    stock: 30, rating: 4.1, reviewCount: 29,
  },
  {
    id: "p5", name: "Compression Tights", category: "Apparel", price: 9500,
    image: joggers,
    description: "Full-length compression tights with targeted muscle support panels. Graduated compression promotes blood flow and faster recovery.",
    sizes: ["XS","S","M","L","XL"], colors: ["Black","Midnight Blue"],
    stock: 20, rating: 4.6, reviewCount: 44,
  },
  {
    id: "p6", name: "Training Tank Top", category: "Apparel", price: 5500, badge: "New",
    image: joggersAlt,
    description: "Loose-fit training tank with deep-cut armholes for ventilation. Made from quick-dry fabric that keeps you cool through the toughest sessions.",
    sizes: ["S","M","L","XL"], colors: ["White","Black","Army Green"],
    stock: 35, rating: 4.0, reviewCount: 17,
  },
  {
    id: "p7", name: "Resistance Bands Set", category: "Equipment", price: 6500,
    image: gymEquip,
    description: "Set of 5 progressive resistance bands (5–50 lb). Suitable for strength training, physiotherapy, glute activation, and full-body stretching.",
    colors: ["Multicolour"],
    stock: 50, rating: 4.8, reviewCount: 61, badge: "Hot",
  },
  {
    id: "p8", name: "Yoga Mat (6mm)", category: "Equipment", price: 8500,
    image: product1,
    description: "Non-slip 6mm thick yoga mat with alignment lines and carry strap. Works on hardwood, tile, and outdoor surfaces.",
    colors: ["Purple","Teal","Black"],
    stock: 22, rating: 4.5, reviewCount: 33,
  },
  {
    id: "p9", name: "Foam Roller", category: "Equipment", price: 5000,
    image: gymEquip,
    description: "High-density EVA foam roller for deep-tissue myofascial release. Textured surface targets knots and tight muscles effectively.",
    colors: ["Black","Blue"],
    stock: 28, rating: 4.4, reviewCount: 19,
  },
  {
    id: "p10", name: "Speed Jump Rope", category: "Equipment", price: 3500,
    image: product1,
    description: "Lightweight ball-bearing jump rope with adjustable PVC cable. Used by boxers and athletes for cardio conditioning and coordination.",
    colors: ["Black","Red"],
    stock: 60, rating: 4.2, reviewCount: 27, badge: "New",
  },
  {
    id: "p11", name: "Gym Duffle Bag", category: "Accessories", price: 14500,
    image: product2,
    description: "Spacious 40L duffle with a separate shoe compartment, wet pocket, and padded shoulder strap. Fits everything for a full gym day.",
    colors: ["Black","Navy","Khaki"],
    stock: 15, rating: 4.6, reviewCount: 41,
  },
  {
    id: "p12", name: "Insulated Water Bottle (1L)", category: "Accessories", price: 4500,
    image: product2,
    description: "Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold for 24 hours and hot for 12. Leak-proof flip-top lid.",
    colors: ["Matte Black","White","Forest Green"],
    stock: 40, rating: 4.7, reviewCount: 55,
  },
  {
    id: "p13", name: "Workout Gloves", category: "Accessories", price: 5500,
    image: product1,
    description: "Full-palm padded gloves with wrist wraps for heavy lifting. Open-finger design maintains grip feel on bars and dumbbells.",
    sizes: ["S","M","L","XL"], colors: ["Black","Grey"],
    stock: 32, rating: 4.3, reviewCount: 23,
  },
  {
    id: "p14", name: "Whey Protein 1kg", category: "Nutrition", price: 28000, badge: "Hot",
    image: product2,
    description: "25g of whey protein per serving with BCAAs and essential amino acids. Low in sugar, mixes easily, and available in three flavours.",
    colors: ["Chocolate","Vanilla","Strawberry"],
    stock: 12, rating: 4.9, reviewCount: 88,
  },
  {
    id: "p15", name: "Pre-Workout (30 srv)", category: "Nutrition", price: 18000,
    image: product1,
    description: "Clinically dosed pre-workout with 200mg caffeine, Beta-Alanine, and Citrulline Malate. Clean energy, no crash.",
    colors: ["Fruit Punch","Blue Raspberry","Watermelon"],
    stock: 18, rating: 4.5, reviewCount: 34,
  },
  {
    id: "p16", name: "Protein Shaker (700ml)", category: "Accessories", price: 3500,
    image: product2,
    description: "BPA-free protein shaker with blender ball and measurement markings. Wide mouth for easy cleaning. Leak-proof screw-top lid.",
    colors: ["Black","Clear","Blue"],
    stock: 55, rating: 4.1, reviewCount: 48,
  },
];

const CATEGORIES: Category[] = ["All","Apparel","Equipment","Accessories","Nutrition"];
const DELIVERY_FEE = 1500;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

function genOrderId() {
  return "EG-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ─────────────────────────────────────────────
// StarRating
// ─────────────────────────────────────────────
function StarRating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1,2,3,4,5].map((s) => (
          <Star
            key={s} size={12}
            className={s <= Math.round(value) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
          />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
  New:  "bg-sky-100 text-sky-700",
  Sale: "bg-red-100 text-red-600",
  Hot:  "bg-amber-100 text-amber-700",
};

// ─────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────
function ProductCard({ product, onView, onAddToCart }: {
  product: Product;
  onView: () => void;
  onAddToCart: () => void;
}) {
  const [wished, setWished] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col overflow-hidden group">
      {/* Image */}
      <div
        className="relative w-full h-48 bg-gray-50 cursor-pointer overflow-hidden"
        onClick={onView}
      >
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width:640px) 50vw, 25vw" />
        {product.badge && (
          <span className={`absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[product.badge]}`}>
            {product.badge}
          </span>
        )}
        {product.stock <= 5 && (
          <span className="absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
            {product.stock} left
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setWished((w) => !w); }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart size={13} className={wished ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug mt-0.5 line-clamp-1 cursor-pointer" onClick={onView}>
            {product.name}
          </h3>
        </div>

        <StarRating value={product.rating} count={product.reviewCount} />

        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-gray-900">{fmt(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{fmt(product.originalPrice)}</span>
          )}
        </div>

        <button
          onClick={onAddToCart}
          className="mt-auto w-full py-2 text-sm font-semibold rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ProductDrawer
// ─────────────────────────────────────────────
function ProductDrawer({ product, onClose, onAddToCart }: {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, "qty">) => void;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);

  const savings = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    if (product.sizes && !selectedSize) return;
    onAddToCart({ product, size: selectedSize || undefined, color: selectedColor });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{product.category}</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full h-64 bg-gray-50 shrink-0">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="420px" />
          {product.badge && (
            <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-0.5 rounded-full ${BADGE_STYLES[product.badge]}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 flex-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h2>
              <button onClick={() => setWished((w) => !w)}>
                <Heart size={18} className={wished ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-400"} />
              </button>
            </div>
            <StarRating value={product.rating} count={product.reviewCount} />
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-gray-900">{fmt(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">{fmt(product.originalPrice)}</span>
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Save {savings}%</span>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

          {/* Size selector */}
          {product.sizes && (
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Size <span className="font-normal text-gray-400 normal-case">— {selectedSize || "Select a size"}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                      selectedSize === s
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Colour <span className="font-normal text-gray-400 normal-case">— {selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3.5 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                    selectedColor === c
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Tag size={11} />
            <span>{product.stock} in stock</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white sticky bottom-0">
          {/* Quantity */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Quantity</span>
            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-gray-500 hover:text-gray-800 transition-colors">
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold w-5 text-center">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="text-gray-500 hover:text-gray-800 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!!product.sizes && !selectedSize}
            className="w-full py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart — {fmt(product.price * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CartDrawer
// ─────────────────────────────────────────────
function CartDrawer({ cart, onClose, onUpdateQty, onRemove, onCheckout }: {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (idx: number, delta: number) => void;
  onRemove: (idx: number) => void;
  onCheckout: () => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">Your Cart</h2>
            <p className="text-xs text-gray-400 mt-0.5">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart size={40} className="text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium text-sm">Your cart is empty</p>
              <p className="text-gray-400 text-xs mt-1">Add products to get started</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {[item.color, item.size].filter(Boolean).join(" · ")}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-1.5 py-0.5">
                      <button onClick={() => onUpdateQty(idx, -1)} className="text-gray-400 hover:text-gray-700"><Minus size={12} /></button>
                      <span className="text-xs font-semibold w-4 text-center">{item.qty}</span>
                      <button onClick={() => onUpdateQty(idx, 1)} className="text-gray-400 hover:text-gray-700"><Plus size={12} /></button>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{fmt(item.product.price * item.qty)}</span>
                  </div>
                </div>
                <button onClick={() => onRemove(idx)} className="text-gray-300 hover:text-red-400 shrink-0 mt-0.5 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3 shrink-0">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="flex items-center gap-1"><Truck size={12} />Delivery</span>
                <span>{fmt(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CheckoutModal  (3 steps)
// ─────────────────────────────────────────────
function CheckoutModal({ cart, onClose, onSuccess }: {
  cart: CartItem[];
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  const [step, setStep] = useState<CheckoutStep>("delivery");
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    fullName:"", email:"", phone:"", address:"", city:"", state:"",
  });
  const [payMethod, setPayMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number:"", expiry:"", cvv:"", name:"" });
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");

  const setDel = (k: keyof DeliveryInfo) => (v: string) => setDelivery((p) => ({ ...p, [k]: v }));

  const deliveryValid =
    delivery.fullName && delivery.email && delivery.phone &&
    delivery.address && delivery.city && delivery.state;

  const paymentValid =
    payMethod === "transfer" || payMethod === "pod" ||
    (card.number.replace(/\s/g,"").length === 16 && card.expiry.length === 5 && card.cvv.length === 3 && card.name);

  async function placeOrder() {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 2000));
    const id = genOrderId();
    setOrderId(id);
    setStep("confirmation");
    setPlacing(false);
    onSuccess(id);
  }

  function fmtCard(v: string) {
    return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  }
  function fmtExpiry(v: string) {
    return v.replace(/\D/g,"").slice(0,4).replace(/^(\d{2})(\d)/, "$1/$2");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">
              {step === "delivery" ? "Delivery Information" : step === "payment" ? "Payment" : "Order Confirmed!"}
            </h2>
            {step !== "confirmation" && (
              <p className="text-xs text-gray-400 mt-0.5">Step {step === "delivery" ? 1 : 2} of 2</p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <X size={16} />
          </button>
        </div>

        {/* Steps indicator */}
        {step !== "confirmation" && (
          <div className="flex px-6 py-3 gap-2 shrink-0">
            {["delivery","payment"].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step === s || (s === "delivery" && step === "payment") ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {i + 1}
                </div>
                <div className={`h-0.5 flex-1 rounded-full ${s === "delivery" && step === "payment" ? "bg-emerald-600" : "bg-gray-100"}`} />
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* ── Step 1: Delivery ── */}
          {step === "delivery" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField icon={<User size={14} />} label="Full Name" value={delivery.fullName} onChange={setDel("fullName")} placeholder="Ade Johnson" />
                <FormField icon={<Mail size={14} />} label="Email" value={delivery.email} onChange={setDel("email")} placeholder="ade@example.com" type="email" />
                <FormField icon={<Phone size={14} />} label="Phone" value={delivery.phone} onChange={setDel("phone")} placeholder="080X XXX XXXX" />
                <FormField icon={<MapPin size={14} />} label="City" value={delivery.city} onChange={setDel("city")} placeholder="Lagos" />
              </div>
              <FormField icon={<MapPin size={14} />} label="Delivery Address" value={delivery.address} onChange={setDel("address")} placeholder="12 Admiralty Road, Lekki Phase 1" />
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">State</label>
                <select
                  value={delivery.state}
                  onChange={(e) => setDel("state")(e.target.value)}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="">Select state</option>
                  {["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* ── Step 2: Payment ── */}
          {step === "payment" && (
            <>
              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Summary</p>
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 flex-1 pr-2">{item.product.name} × {item.qty}</span>
                    <span className="font-medium text-gray-900 shrink-0">{fmt(item.product.price * item.qty)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery</span><span>{fmt(DELIVERY_FEE)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total</span><span>{fmt(total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery address recap */}
              <div className="text-xs text-gray-500 flex items-start gap-1.5">
                <Truck size={12} className="shrink-0 mt-0.5" />
                <span>Delivering to: <span className="font-medium text-gray-700">{delivery.address}, {delivery.city}, {delivery.state}</span></span>
              </div>

              {/* Payment method tabs */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment Method</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "card",     label: "Card",     icon: <CreditCard size={16} /> },
                    { id: "transfer", label: "Transfer",  icon: <Building2 size={16} /> },
                    { id: "pod",      label: "On Delivery",icon: <Package size={16} /> },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                        payMethod === m.id
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card form */}
              {payMethod === "card" && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                  <FormField icon={<User size={14} />} label="Name on Card" value={card.name} onChange={(v) => setCard((c) => ({ ...c, name: v }))} placeholder="Ade Johnson" />
                  <FormField icon={<CreditCard size={14} />} label="Card Number" value={card.number} onChange={(v) => setCard((c) => ({ ...c, number: fmtCard(v) }))} placeholder="0000 0000 0000 0000" />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Expiry" value={card.expiry} onChange={(v) => setCard((c) => ({ ...c, expiry: fmtExpiry(v) }))} placeholder="MM/YY" />
                    <FormField label="CVV" value={card.cvv} onChange={(v) => setCard((c) => ({ ...c, cvv: v.replace(/\D/g,"").slice(0,3) }))} placeholder="123" type="password" />
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <span>🔒</span> Your card details are encrypted and secure
                  </p>
                </div>
              )}

              {/* Bank transfer instructions */}
              {payMethod === "transfer" && (
                <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl space-y-2">
                  <p className="text-sm font-semibold text-sky-800">Bank Transfer Details</p>
                  <div className="text-sm text-sky-700 space-y-1">
                    <p><span className="text-sky-500">Bank:</span> GTBank (Guaranty Trust Bank)</p>
                    <p><span className="text-sky-500">Account Name:</span> Eugym Store Ltd</p>
                    <p><span className="text-sky-500">Account Number:</span> <span className="font-mono font-bold">0123456789</span></p>
                    <p><span className="text-sky-500">Amount:</span> <span className="font-bold">{fmt(total)}</span></p>
                  </div>
                  <p className="text-[11px] text-sky-600 mt-2">
                    Use your name as payment reference. Order will be confirmed after payment is verified (within 2 hours).
                  </p>
                </div>
              )}

              {/* Pay on delivery note */}
              {payMethod === "pod" && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800">Pay on Delivery</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Have exactly <span className="font-bold">{fmt(total)}</span> ready for the courier. Delivery takes 2–4 business days.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === "confirmation" && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Placed!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Thanks, {delivery.fullName.split(" ")[0]}. Your order has been received.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 w-full text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-mono font-bold text-gray-900">{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-semibold text-gray-900">{fmt(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery to</span>
                  <span className="font-medium text-gray-700 text-right max-w-[60%]">{delivery.city}, {delivery.state}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated</span>
                  <span className="font-medium text-emerald-600">2–4 business days</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                A confirmation will be sent to <span className="font-medium">{delivery.email}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 space-y-2">
          {step === "delivery" && (
            <button
              disabled={!deliveryValid}
              onClick={() => setStep("payment")}
              className="w-full py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              Continue to Payment <ChevronRight size={15} />
            </button>
          )}
          {step === "payment" && (
            <>
              <button
                disabled={!paymentValid || placing}
                onClick={placeOrder}
                className="w-full py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {placing ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                ) : (
                  <>Place Order — {fmt(total)} <CheckCircle size={15} /></>
                )}
              </button>
              <button onClick={() => setStep("delivery")} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">
                ← Back to delivery
              </button>
            </>
          )}
          {step === "confirmation" && (
            <button onClick={onClose} className="w-full py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Reusable form field
// ─────────────────────────────────────────────
function FormField({ icon, label, value, onChange, placeholder, type = "text" }: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</label>
      <div className="relative mt-1">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-lg py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${icon ? "pl-9 pr-3" : "px-3"}`}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function StorePage() {
  const user = useDashboardUser();

  const [search, setSearch]               = useState("");
  const [activeCategory, setCategory]     = useState<Category>("All");
  const [selectedProduct, setSelected]    = useState<Product | null>(null);
  const [cartOpen, setCartOpen]           = useState(false);
  const [checkoutOpen, setCheckoutOpen]   = useState(false);
  const [cart, setCart]                   = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder]         = useState("");

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PRODUCTS.filter((p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }, [search, activeCategory]);

  function addToCart({ product, size, color }: Omit<CartItem, "qty">) {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size && i.color === color
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(product.stock, next[idx].qty + 1) };
        return next;
      }
      return [...prev, { product, size, color, qty: 1 }];
    });
    setCartOpen(true);
  }

  function quickAdd(product: Product) {
    addToCart({ product, size: product.sizes?.[1], color: product.colors[0] });
  }

  function updateQty(idx: number, delta: number) {
    setCart((prev) => {
      const next = [...prev];
      const newQty = next[idx].qty + delta;
      if (newQty <= 0) return next.filter((_, i) => i !== idx);
      next[idx] = { ...next[idx], qty: Math.min(next[idx].product.stock, newQty) };
      return next;
    });
  }

  function removeFromCart(idx: number) {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleOrderSuccess(id: string) {
    setLastOrder(id);
    setCart([]);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Store</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Gear up for your best performance, {user.firstName}
            </p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-emerald-400 hover:text-emerald-600 transition-colors shadow-sm"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
            <Package size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No products found</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-3 text-sm text-emerald-600 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={() => setSelected(p)}
                onAddToCart={() => quickAdd(p)}
              />
            ))}
          </div>
        )}

        {/* Last order banner */}
        {lastOrder && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700">
              Order <span className="font-mono font-bold">{lastOrder}</span> placed successfully! Estimated delivery in 2–4 business days.
            </p>
            <button onClick={() => setLastOrder("")} className="ml-auto text-emerald-400 hover:text-emerald-600">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Overlays */}
      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={() => setSelected(null)}
          onAddToCart={(item) => { addToCart(item); setSelected(null); }}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={(id) => { handleOrderSuccess(id); }}
        />
      )}
    </div>
  );
}
