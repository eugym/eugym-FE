"use client";
import InputField from "@/components/inputs/input";
import Modal from "@/components/modals/modal";
import { Pagination } from "@/components/pagination";
import { ITableBody, ITableHead, Table } from "@/components/table";
import Button from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function userManagement() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [form, setForm] = useState({
    user: "",
    email: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //   const { data, isLoading } = useQuery({
  //   queryKey: ["users", page, perPage],
  //   queryFn: () => fetchUsers({ page, perPage }),
  //   keepPreviousData: true,
  // });

  // 1️⃣ TABLE HEADERS
  const headers: ITableHead[] = [
    {
      name: "firstName",
      label: "First Name",
    },
    {
      name: "lastName",
      label: "Last Name",
    },
    {
      name: "email",
      label: "Email Address",
    },
    {
      name: "role",
      label: "Role",
    },
    {
      name: "status",
      label: "Status",
    },
  ];

  // 2️⃣ TABLE BODY
  const body: ITableBody[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
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
      <div>
        <div className="flex justify-end  gap-5 p-5">
          {" "}
          <Button onClick={() => setIsOpen(true)}> Add User</Button>
          <Button variant="secondary"> Export Data</Button>
        </div>
        <Table
          /* Core */
          headers={headers}
          body={body}
          /* UI */
          title="Users"
          subTitle="List of registered users"
          loading={loading}
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
        <Pagination
          currentPage={page}
          pageCount={1}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(size) => {
            setPage(1);
            setPerPage(size);
          }}
        />
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add User">
        <form>
          <div className="flex flex-wrap gap-5">
            <InputField
              label="add user type"
              placeholder="user type"
              type="text"
              value={form?.user}
              onChange={(val) => handleChange("user", val)}
            />
            <InputField
              label="Email"
              type="email"
              value={form?.email}
              onChange={(val) => handleChange("email", val)}
            />
          </div>
          <Button
            type="submit"
            className=" my-5 w-1/2 flex justify-self-center"
          >
            Send Invitation
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default userManagement;
