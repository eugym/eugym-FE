"use client";
import { ITableBody, ITableHead, Table } from "@/components/table";
import Button from "@/components/ui/Button";
import React from "react";
import Image from "next/image";
import img from "@/public/images/Sport Bra.jpg";
import img2 from "@/public/images/joggers.jpg";

function machandise() {
  const headers: ITableHead[] = [
    {
      name: "image",
      label: "Images",
    },
    {
      name: "productName",
      label: "Product Name",
    },
    {
      name: "product_id",
      label: "Product ID",
    },
    {
      name: "stock",
      label: "Stock",
    },
    {
      name: "price",
      label: "Prices",
    },
  ];

  // 2️⃣ TABLE BODY
  const body: ITableBody[] = [
    {
      id: "1",
      image: (
        <div className="flex items-center gap-3">
          <Image src={img} alt="John Doe" width={42} height={32} />
        </div>
      ),
      productName: "Doe",
      product_id: "D99-0",
      stock: "32",
      price: "#4000",
    },

    {
      id: "2",
      image: (
        <div className="flex items-center gap-3">
          <Image
            src={img2}
            alt="John Doe"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      ),
      productName: "Hosea",
      product_id: "D99-1",
      stock: "30",
      price: "#4000",
    },

    {
      id: "2",
      image: (
        <div className="flex items-center gap-3">
          <Image
            src="/"
            alt="John Doe"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      ),
      productName: "Hosea",
      product_id: "D99-1",
      stock: "30",
      price: "#4000",
    },
  ];

  // 3️⃣ DROPDOWN ACTIONS
  const dropdownOptions = [
    {
      label: "View",
      action: (row: ITableBody) => {
        console.log("View user:", row);
      },
    },
    {
      label: "Edit",
      action: (row: ITableBody) => {
        console.log("Edit user:", row);
      },
    },
    {
      label: "Delete",
      action: (row: ITableBody) => {
        console.log("Delete user:", row);
      },
      loading: false,
    },
  ];

  // 4️⃣ OPTIONAL HANDLER
  const handleActionClicked = (row: ITableBody) => {
    console.log("Action button clicked for:", row.id);
  };

  return (
    <>
      <div className="flex justify-end  gap-5 p-5">
        {" "}
        <Button> Add Product</Button>
        <Button variant="secondary"> Export Data</Button>
      </div>
      <Table
        /* Core */
        headers={headers}
        body={body}
        /* UI */
        title="Products"
        subTitle="List of registered products"
        // loading={loading}
        /* Serial Number */
        showSerialNumber={true}
        /* Dropdown */
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        handleActionClicked={handleActionClicked}
        /* Pagination */
        showPagination={true}
        // pageCount={10}
        // onNextPage={(page) => console.log("Next page:", page)}
        // onPerPageChange={(perPage) => console.log("Per page changed:", perPage)}
      />
    </>
  );
}

export default machandise;
