"use client";

import Modal from "@/components/modals/modal";
import { Pagination } from "@/components/pagination";
import { ITableBody, ITableHead, Table } from "@/components/table";
import Button from "@/components/ui/Button";
import { useMemo, useState } from "react";
import RegisterUser from "./RegisterUser";
import InviteAdminUser from "./inviteAdminUser";
import { useGetQuery } from "@/hooks/useGetQuery";
import { IUser } from "@/types/userTableData";

function userManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [openRegisterUser, setOpenRegisterUser] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // const [mounted, setMounted] = useState(false);

  const { data, isLoading, error } = useGetQuery("user/all");

  const mapUsersToTableBody = (users: IUser[]): ITableBody[] => {
    return users?.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      phoneNumber: user.phoneNumber,
      role: user.role.replace("_", " "),
      status: user.status,
    }));
  };
  // console.log(data);
  const userlist = useMemo(() => {
    return mapUsersToTableBody(data?.data?.allUser?.users || []);
  }, [data]);

  // ******* to get table data *****
  interface User {
    id: string;
    email: string;
    role: string;
  }

  // 1️⃣ TABLE HEADERS
  const headers: ITableHead[] = [
    { name: "email", label: "Email" },
    { name: "fullName", label: "Full Name" },
    { name: "phoneNumber", label: "Phone" },
    { name: "role", label: "Role" },
    { name: "status", label: "Status" },
  ];

  // 2️⃣ TABLE BODY

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
          <Button onClick={() => setOpenRegisterUser(true)}>
            Register Member
          </Button>
          <Button onClick={() => setIsOpen(true)}> Invite User</Button>
          <Button variant="secondary"> Export Data</Button>
        </div>

        <Table
          title="Users"
          subTitle="All registered users"
          headers={headers}
          body={userlist}
          loading={isLoading}
          showSerialNumber
          allowSearchBar
          allowFilterBar
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
        <InviteAdminUser onSuccess={() => setIsOpen(false)} />
      </Modal>

      <Modal
        isOpen={openRegisterUser}
        onClose={() => setOpenRegisterUser(false)}
        title="Register User"
      >
        <>
          <RegisterUser onSuccess={() => setOpenRegisterUser(false)} />
        </>
      </Modal>
    </>
  );
}

export default userManagement;
