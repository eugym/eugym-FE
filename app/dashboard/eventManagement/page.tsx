"use client";
import { ITableBody, ITableHead, Table } from "@/components/table";
import Button from "@/components/ui/Button";

function EventManagement() {
  const headers: ITableHead[] = [
    {
      name: "eventType",
      label: "Event Type",
    },
    {
      name: "eventName",
      label: "Event Name",
    },
    {
      name: "eventDate",
      label: "Event Date",
    },
    {
      name: "eventTime",
      label: "Event Time",
    },
    {
      name: "capacity",
      label: "Capacity",
    },
  ];

  // 2️⃣ TABLE BODY
  const body: ITableBody[] = [
    {
      id: "1",
      eventType: "Out Door",
      eventName: "Oparmini",
      eventDate: "20-4-2026",
      eventTime: "10am",
      capacity: "50",
    },
    {
      id: "2",
      eventType: "Out Door",
      eventName: "Oparmini",
      eventDate: "20-4-2026",
      eventTime: "10am",
      capacity: "50",
    },

    {
      id: "3",
      eventType: "Out Door",
      eventName: "Oparmini",
      eventDate: "20-4-2026",
      eventTime: "10am",
      capacity: "50",
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
        <Button> Create Events</Button>
      </div>
      <Table
        headers={headers}
        body={body}
        /* UI */
        title="Total Event"
        subTitle="75 events"
        showSerialNumber={true}
        /* Dropdown */
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        handleActionClicked={handleActionClicked}
      />
    </>
  );
}

export default EventManagement;
