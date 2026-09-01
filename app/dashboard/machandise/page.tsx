"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Package } from "lucide-react";
import { Table, ITableBody, ITableHead } from "@/components/table";
import Button from "@/components/ui/Button";
import Modal from "@/components/modals/modal";
import {
  useBackendQuery,
  useBackendMutation,
  errorMessage,
} from "@/hooks/useBackend";
import {
  PageHeader,
  DataState,
  EmptyState,
} from "../components/shared/PageShell";
import ProductForm, { type ProductFormValues } from "./ProductForm";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  STATUS_LABELS,
  formatNaira,
  type Product,
} from "./types";

// The list is filtered and searched client-side, so pull the whole catalogue in
// one page rather than paginating twice. 100 is the backend's hard ceiling.
const LIST_PATH = "admin/merchandise?limit=100";

const HEADERS: ITableHead[] = [
  { name: "image", label: "" },
  { name: "productName", label: "Product" },
  { name: "sku", label: "SKU" },
  { name: "category", label: "Category" },
  { name: "price", label: "Price" },
  { name: "stock", label: "Stock" },
  { name: "status", label: "Status" },
];

type Editing = { mode: "create" } | { mode: "edit"; product: Product };

export default function MerchandiseManagement() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<Product[]>(LIST_PATH);

  const [editing, setEditing] = useState<Editing | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const createProduct = useBackendMutation<Record<string, unknown>, Product>(
    "admin/merchandise",
    "POST",
    [LIST_PATH]
  );

  // The id rides along in the body so the path can be derived from it; the
  // endpoint's zod schema strips unknown keys, so it never reaches the UPDATE.
  const updateProduct = useBackendMutation<
    { id: string } & Record<string, unknown>,
    Product
  >((body) => `admin/merchandise/${body.id}`, "PATCH", [LIST_PATH]);

  const rows: ITableBody[] = useMemo(
    () =>
      (data ?? []).map((p) => ({
        id: p.id,
        image: <Thumbnail src={p.images?.[0]} alt={p.name} />,
        productName: p.name,
        sku: p.sku,
        category: CATEGORY_LABELS[p.category] ?? p.category,
        price: formatNaira(p.price),
        // Stock drives the restock decision, so make a depleted item obvious
        // rather than leaving a bare "0" to be scanned past.
        stock:
          p.stock === 0 ? <span className="text-red-600">0</span> : p.stock,
        status: STATUS_LABELS[p.status] ?? p.status,
        _raw: p,
      })),
    [data]
  );

  function closeForm() {
    setEditing(null);
    setFormError(null);
  }

  function handleSubmit(values: ProductFormValues) {
    setFormError(null);

    if (editing?.mode === "create") {
      createProduct.mutate(
        {
          name: values.name,
          sku: values.sku,
          category: values.category,
          price: values.price,
          stock: values.stock,
          // The endpoint takes description as optional; send undefined rather
          // than "" so an untouched field doesn't persist an empty string.
          description: values.description || undefined,
          images: values.images,
        },
        {
          onSuccess: () => {
            toast.success(`${values.name} added`);
            closeForm();
          },
          onError: (err) => setFormError(errorMessage(err)),
        }
      );
      return;
    }

    if (editing?.mode === "edit") {
      updateProduct.mutate(
        {
          id: editing.product.id,
          name: values.name,
          price: values.price,
          stock: values.stock,
          status: values.status,
        },
        {
          onSuccess: () => {
            toast.success(`${values.name} updated`);
            closeForm();
          },
          onError: (err) => setFormError(errorMessage(err)),
        }
      );
    }
  }

  function toggleStatus(product: Product) {
    const next = product.status === "inactive" ? "active" : "inactive";

    updateProduct.mutate(
      { id: product.id, status: next },
      {
        onSuccess: () =>
          toast.success(
            next === "inactive"
              ? `${product.name} hidden from the store`
              : `${product.name} is back in the store`
          ),
        onError: (err) => toast.error(errorMessage(err)),
      }
    );
  }

  const dropdownOptions = [
    {
      label: "Edit",
      action: (row: ITableBody) =>
        setEditing({ mode: "edit", product: row._raw as Product }),
    },
    {
      // No DELETE endpoint exists, and products are referenced by order_items —
      // removing one would tear a hole in past orders. Deactivating pulls it
      // from the store while keeping order history intact.
      label: "Deactivate / Reactivate",
      action: (row: ITableBody) => toggleStatus(row._raw as Product),
      danger: true,
    },
  ];

  const activeCount = (data ?? []).filter((p) => p.status === "active").length;
  const outOfStock = (data ?? []).filter((p) => p.stock === 0).length;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Merchandise"
        subtitle={
          data
            ? `${data.length} product${data.length === 1 ? "" : "s"} · ${activeCount} active${
                outOfStock ? ` · ${outOfStock} out of stock` : ""
              }`
            : "Products in the Eugym store"
        }
        action={
          <Button onClick={() => setEditing({ mode: "create" })}>
            Add product
          </Button>
        }
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={rows}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<Package size={26} />}
            title="No products yet"
            description="Add your first product to start selling in the Eugym store."
            action={
              <Button onClick={() => setEditing({ mode: "create" })}>
                Add product
              </Button>
            }
          />
        }
      >
        {(body) => (
          <Table
            headers={HEADERS}
            body={body}
            allowSearchBar
            allowFilterBar
            filterOptions={[
              { label: "Active", value: "Active", column: "status" },
              { label: "Inactive", value: "Inactive", column: "status" },
              {
                label: "Out of stock",
                value: "Out of stock",
                column: "status",
              },
              ...CATEGORIES.map((c) => ({
                label: CATEGORY_LABELS[c],
                value: CATEGORY_LABELS[c],
                column: "category",
              })),
            ]}
            dropdownOptions={dropdownOptions}
          />
        )}
      </DataState>

      <Modal
        isOpen={editing !== null}
        onClose={closeForm}
        title={editing?.mode === "edit" ? "Edit product" : "Add product"}
        widthClass="max-w-lg"
      >
        {editing && (
          <ProductForm
            // Remount per product so the fields reset instead of carrying the
            // previous row's values into the next edit.
            key={editing.mode === "edit" ? editing.product.id : "create"}
            mode={editing.mode}
            initial={editing.mode === "edit" ? editing.product : undefined}
            submitting={createProduct.isPending || updateProduct.isPending}
            serverError={formError}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}
      </Modal>
    </div>
  );
}

/**
 * Product images are admin-entered URLs pointing at any host, and next/image
 * renders an undeclared host as a broken image. A plain img with a fallback
 * degrades to a neutral placeholder instead.
 */
function Thumbnail({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400"
        aria-hidden="true"
      >
        <Package size={16} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="h-10 w-10 rounded-lg object-cover"
      onError={() => setFailed(true)}
    />
  );
}
