/**
 * Shapes for the merchandise admin screens (§3.6 "Merchandise Management Page",
 * FR-A3).
 *
 * GET /admin/merchandise returns raw Postgres rows — unlike /admin/trainers it
 * does not run them through a mapper — so these fields are snake_case. Don't
 * "tidy" them to camelCase without changing the endpoint first.
 */

export const CATEGORIES = [
  "fitness_wear",
  "accessories",
  "supplements",
  "wellness",
  "branded",
] as const;

export type ProductCategory = (typeof CATEGORIES)[number];

export const STATUSES = ["active", "inactive", "out_of_stock"] as const;

export type ProductStatus = (typeof STATUSES)[number];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  fitness_wear: "Fitness wear",
  accessories: "Accessories",
  supplements: "Supplements",
  wellness: "Wellness",
  branded: "Branded",
};

export const STATUS_LABELS: Record<ProductStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  out_of_stock: "Out of stock",
};

export interface ProductVariant {
  id: string;
  label: string;
  stock: number;
  price_modifier: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  /** Naira, not kobo — the order flow multiplies by 100 for Paystack. */
  price: number;
  images: string[];
  sku: string;
  stock: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[] | null;
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
