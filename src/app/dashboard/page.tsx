"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function DashboardPage() {

  const [stats] = useState({
    customers: 2,
    appointments: 0,
    jobOrders: 0,
    income: 78250,
    lowStock: 0,
  });

  const [incomeData] = useState([
    { month: "Sept", income: 0 },
    { month: "Oct", income: 15000 },
    { month: "Nov", income: 13000 },
    { month: "Dec", income: 17000 },
  ]);

  const [inventoryData] = useState([
    { name: "Oil", stock: 120 },
    { name: "Tires", stock: 80 },
    { name: "Chains", stock: 45 },
    { name: "Lights", stock: 65 },
    { name: "Brakes", stock: 90 },
  ]);

  return (
    <div
      className="min-h-screen w-full bg-center bg-cover relative"
      style={{ backgroundImage: "url('/dbbg.png')" }}
    >
      {/* Overlay */}
      <div className="bg-black/50 backdrop-blur-md min-h-screen w-full">

        {/* Dashboard content */}
        <div className="relative z-10 p-6 space-y-8 text-gray-100 max-w-full">

          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-200">Summary of MotoServe performance and activity.</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Customers", value: stats.customers, color: "bg-blue-500" },
              { label: "Appointments", value: stats.appointments, color: "bg-green-500" },
              { label: "Job Orders", value: stats.jobOrders, color: "bg-yellow-500" },
              { label: "Income (₱)", value: stats.income.toLocaleString(), color: "bg-indigo-500" },
              { label: "Low Stock Items", value: stats.lowStock, color: "bg-red-500" },
            ].map((card) => (
              <div
                key={card.label}
                className={`${card.color} text-white p-4 rounded-lg shadow-md bg-opacity-90`}
              >
                <h2 className="text-lg font-semibold">{card.label}</h2>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Monthly Income Report</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="month" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Top Inventory Items</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" fill="#10B981" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Tables */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow text-white">
              <h2 className="text-lg font-semibold mb-3">Recent Appointments</h2>
              <table className="min-w-full text-sm">
                <thead className="text-gray-200 border-b border-gray-500">
                  <tr>
                    <th className="py-2 text-left">Customer</th>
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-500">
                    <td className="py-2">Yangco</td>
                    <td className="py-2">Nov 10, 2025</td>
                    <td className="py-2 text-green-400 font-semibold">Completed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow text-white">
              <h2 className="text-lg font-semibold mb-3">Recent Payments</h2>
              <table className="min-w-full text-sm">
                <thead className="text-gray-200 border-b border-gray-500">
                  <tr>
                    <th className="py-2 text-left">Invoice ID</th>
                    <th className="py-2 text-left">Customer</th>
                    <th className="py-2 text-left">Amount</th>
                    <th className="py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-500">
                    <td className="py-2">INV-001</td>
                    <td className="py-2">Yangco</td>
                    <td className="py-2">₱69,420</td>
                    <td className="py-2 text-yellow-300 font-semibold">Partial</td>
                  </tr>
                  <tr>
                    <td className="py-2">INV-002</td>
                    <td className="py-2">Baylon</td>
                    <td className="py-2">₱250</td>
                    <td className="py-2 text-green-400 font-semibold">Paid</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
