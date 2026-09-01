import { Mail, Phone, MapPin, Youtube, X, Facebook } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/asset/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19] text-gray-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Column 1 */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            {/* The logo artwork is a full lockup — gold barbell plus a black
                EUGYM FITNESS wordmark — so it needs a light chip to sit on.
                Placed straight onto #0B0F19 the wordmark inside it vanishes. */}
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-white p-1.5">
              <Image
                src={logo}
                alt=""
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </span>
            <h3 className="text-xl font-semibold text-white">Eugym Fitness</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Nigeria&apos;s premier fitness network connecting you to premium
            gyms, expert trainers, and wellness experiences nationwide.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Gym Access
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Personal Training
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Nutrition Plans
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Corporate Wellness
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Gym Partners
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <Phone size={16} className="text-green-400" />
              <span>+234 802 123 4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={16} className="text-green-400" />
              <span>eugymfitness@gmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={16} className="text-green-400" />
              <span>support@eugymfitness.com</span>
            </li>
            <li className="flex items-start space-x-2">
              <MapPin size={16} className="text-green-400 mt-0.5" />
              <span>
                Beside NUT head office, ACO Estate <br /> Abuja, Nigeria
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800"></div>

      {/* Bottom section */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-xs text-gray-500">
          © {year} Eugym Fitness. All rights reserved.
        </p>

        <div className="flex space-x-5 text-gray-400">
          <Link href="#" aria-label="LinkedIn" className="hover:text-green-400">
            <Facebook size={18} />
          </Link>
          <Link href="#" aria-label="YouTube" className="hover:text-green-400">
            <Youtube size={18} />
          </Link>
          <Link href="#" aria-label="X" className="hover:text-green-400">
            <X size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
