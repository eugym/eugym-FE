import { ITableBody, ITableHead, Table } from "@/components/table";
import StatCard from "../components/cards/statsCard";
import RevenueBarChart from "../components/charts/RevenueBarChart";
import UsersPieChart from "../components/charts/UsersPieChart";
import { Users, UserCheck, Repeat, CreditCard, DollarSign } from "lucide-react";
import { TableBody } from "@mui/material";

export default function Admin() {
  const headers: ITableHead[] = [
    { name: "companyName", label: "Company Name" },
    { name: "email", label: "Email Address" },
    { name: "phoneNumber", label: "Phone Number" },
  ];

  const body: ITableBody[] = [
    {
      id: "1",
      companyName: "Eugym Fitness",
      email: "john@example.com",
      phoneNumber: "Admin",
    },

    {
      id: "2",
      companyName: "Eugym Fitness",
      email: "john@example.com",
      phoneNumber: "Admin",
    },

    {
      id: "3",
      companyName: "Eugym Fitness",
      email: "john@example.com",
      phoneNumber: "Admin",
    },

    {
      id: "4",
      companyName: "Eugym Fitness",
      email: "john@example.com",
      phoneNumber: "Admin",
    },
  ];

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Today's signIn"
            value="20"
            icon={<Users className="h-5 w-5 text-green-600" />}
            iconBg="bg-green-100"
          />
          <StatCard
            title="Total Gym Users"
            value={33}
            icon={<Users className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Total Trainers"
            value={20}
            icon={<UserCheck className="h-5 w-5 text-gray-700" />}
            iconBg="bg-gray-200"
          />
          <StatCard
            title="Affiliate Check-ins"
            value={20}
            icon={<Repeat className="h-5 w-5 text-green-600" />}
            iconBg="bg-green-100"
          />
          <StatCard
            title="New Sign-in"
            value={33}
            icon={<Repeat className="h-5 w-5 text-indigo-600" />}
            iconBg="bg-indigo-100"
          />
          <StatCard
            title="Active Paid Subscribers"
            value={20}
            icon={<CreditCard className="h-5 w-5 text-gray-600" />}
            iconBg="bg-gray-200"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3 ">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Monthly Revenue Trend</h2>

              <div className="flex gap-2">
                <select className="rounded-md border px-2 py-1 text-sm w-[70px]">
                  <option>All</option>
                </select>
                <select className="rounded-md border px-2 py-1 text-sm">
                  <option>2024</option>
                </select>
              </div>
            </div>

            <RevenueBarChart />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Users Distribution</h2>
            <UsersPieChart />
          </div>
        </div>
        <div className="">
          <Table
            headers={headers}
            body={body || []}
            title="Coorperate Clients "
            showSerialNumber
          />
        </div>
      </div>
    </>
  );
}
