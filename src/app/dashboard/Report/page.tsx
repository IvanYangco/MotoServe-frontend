"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function ReportAnalysisPage() {
  const [incomeData, setIncomeData] = useState([
    { month: "Sept", income: 0 },
    { month: "Oct", income: 15000 },
    { month: "Nov", income: 13000 },
    { month: "Dec", income: 17000 },
  ]);

  const [inventoryData, setInventoryData] = useState([
    { category: "Oil", stock: 120 },
    { category: "Tires", stock: 80 },
    { category: "Chains", stock: 45 },
    { category: "Lights", stock: 65 },
    { category: "Brakes", stock: 90 },
  ]);

  useEffect(() => {
    // fetch real backend data if needed
  }, []);

  return (
    <div
      className="min-h-screen p-6 space-y-10 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/reportbg.png')" }}  // 🔥 Change to your image name
    >
      <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold">Report Analysis</h1>
        <p className="text-gray-300">Visual overview of business performance.</p>
      </div>

      {/* Line Chart - Income Report */}
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

      {/* Bar Chart - Inventory Report */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/10">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Inventory Report</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="category" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#10B981" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
