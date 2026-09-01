"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  STATUSES,
  STATUS_LABELS,
  type Product,
  type ProductCategory,
  type ProductStatus,
} from "./types";

export interface ProductFormValues {
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description: string;
  images: string[];
  status: ProductStatus;
}

/**
 * Create/edit form for a product.
 *
 * Edit mode hides SKU and category because PATCH /admin/merchandise/:id only
 * accepts name, price, stock and status. Showing a field the endpoint will
 * silently ignore is worse than not showing it — the admin would believe a
 * change had saved.
 */
export default function ProductForm({
  mode,
  initial,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initial?: Product;
  submitting: boolean;
  serverError?: string | null;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    initial?.category ?? "fitness_wear"
  );
  // Numbers stay strings while editing so the field can be empty mid-typing
  // instead of snapping back to 0.
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [stock, setStock] = useState(initial ? String(initial.stock) : "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [images, setImages] = useState((initial?.images ?? []).join("\n"));
  const [status, setStatus] = useState<ProductStatus>(
    initial?.status ?? "active"
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = mode === "edit";

  function validate(imageList: string[]): Record<string, string> {
    const next: Record<string, string> = {};

    // Mirrors the backend zod schema so a fixable mistake shows inline rather
    // than coming back as a 400 the admin has to decode.
    if (name.trim().length < 3) next.name = "Must be at least 3 characters.";

    if (!isEdit && sku.trim().length < 3)
      next.sku = "Must be at least 3 characters.";

    const priceNum = Number(price);
    if (!price.trim() || !Number.isInteger(priceNum) || priceNum <= 0)
      next.price = "Enter a whole number of naira above zero.";

    const stockNum = Number(stock);
    if (!stock.trim() || !Number.isInteger(stockNum) || stockNum < 0)
      next.stock = "Enter a whole number, zero or more.";

    const bad = imageList.filter((url) => !URL.canParse(url));
    if (bad.length) next.images = `Not a valid URL: ${bad[0]}`;

    return next;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const imageList = images
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const found = validate(imageList);
    setErrors(found);
    if (Object.keys(found).length) return;

    onSubmit({
      name: name.trim(),
      sku: sku.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      description: description.trim(),
      images: imageList,
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label" htmlFor="product-name">
          Product name
        </label>
        <input
          id="product-name"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Eugym Training Shorts"
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </div>

      {!isEdit && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="product-sku">
              SKU
            </label>
            <input
              id="product-sku"
              className="form-input"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="EG-SH-001"
            />
            {errors.sku && <FieldError>{errors.sku}</FieldError>}
          </div>

          <div>
            <label className="form-label" htmlFor="product-category">
              Category
            </label>
            <select
              id="product-category"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="form-label" htmlFor="product-price">
            Price (₦)
          </label>
          <input
            id="product-price"
            className="form-input"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="8500"
          />
          {errors.price && <FieldError>{errors.price}</FieldError>}
        </div>

        <div>
          <label className="form-label" htmlFor="product-stock">
            Stock
          </label>
          <input
            id="product-stock"
            className="form-input"
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="50"
          />
          {errors.stock && <FieldError>{errors.stock}</FieldError>}
        </div>
      </div>

      {isEdit && (
        <div>
          <label className="form-label" htmlFor="product-status">
            Status
          </label>
          <select
            id="product-status"
            className="form-input"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      )}

      {!isEdit && (
        <>
          <div>
            <label className="form-label" htmlFor="product-description">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="product-description"
              className="form-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Premium moisture-wicking shorts"
            />
          </div>

          <div>
            <label className="form-label" htmlFor="product-images">
              Image URLs <span className="text-gray-400">(one per line)</span>
            </label>
            <textarea
              id="product-images"
              className="form-input"
              rows={2}
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="https://images.unsplash.com/photo-…"
            />
            {errors.images ? (
              <FieldError>{errors.images}</FieldError>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                File upload isn&rsquo;t wired up yet — paste a hosted image URL.
              </p>
            )}
          </div>
        </>
      )}

      {serverError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {serverError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? "Save changes" : "Add product"}
        </Button>
      </div>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}
