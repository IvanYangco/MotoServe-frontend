"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function ReportAnalysisPage() {
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5043/api/Report/income")
      .then((res) => res.json())
      .then((data) => setIncomeData(data));

    fetch("http://localhost:5043/api/Report/inventory")
      .then((res) => res.json())
      .then((data) => setInventoryData(data));
  }, []);

  return (
    <div
      className="min-h-screen p-6 space-y-10 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/reportbg.png')" }}
    >
      {/* HEADER */}
      <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold">Report Analysis</h1>
        <p className="text-gray-300">Visual overview of business performance.</p>
      </div>

      {/* LINE CHART - INCOME */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/10">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Income Report</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="month" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART - INVENTORY */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/10">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Inventory Report</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="category" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#d5d82bff" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
