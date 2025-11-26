"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    fetch("http://localhost:5043/api/Dashboard")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error:", err));
  }, []);

  if (!stats) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('/dbbg.png')" }}>
      <div className="bg-black/50 backdrop-blur-md min-h-screen w-full p-6 text-gray-100">

        {/* Header */}
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-300">Summary of MotoServe performance and activity.</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {[
            { label: "Customers", value: stats.customers, color: "bg-blue-500" },
            { label: "Appointments", value: stats.appointments, color: "bg-green-500" },
            { label: "Job Orders", value: stats.jobOrders, color: "bg-yellow-500" },
            { label: "Income (₱)", value: stats.income.toLocaleString(), color: "bg-indigo-500" },
            { label: "Low Stock Items", value: stats.lowStock, color: "bg-red-500" },
          ].map((card) => (
            <div key={card.label} className={`${card.color} p-4 rounded-lg shadow bg-opacity-90`}>
              <h2 className="font-semibold">{card.label}</h2>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
  
  {/* Monthly Income Report */}
  <div className="bg-white/10 p-4 rounded shadow backdrop-blur-md">
    <h2 className="font-semibold mb-3">Monthly Income Report</h2>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={stats.incomeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="income" stroke="#3B82F6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Top Inventory Items */}
  <div className="bg-white/10 p-4 rounded shadow backdrop-blur-md">
    <h2 className="font-semibold mb-3">Top Inventory Items</h2>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={stats.inventoryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* 🔥 Thinner Bar */}
        <Bar dataKey="stock" fill="#d5d82bff" barSize={25} /> 
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>



      </div>
    </div>
  );
}
