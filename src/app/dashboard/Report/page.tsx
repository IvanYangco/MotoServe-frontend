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

  // Optional: Replace with real backend calls
  useEffect(() => {
    // Example fetch:
    // fetch("http://localhost:5218/api/report/income")
    //   .then(res => res.json())
    //   .then(data => setIncomeData(data));
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Report Analysis</h1>
      <p className="text-gray-600">Visual overview of business performance.</p>

      {/* Line Chart - Income Report */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Income Report</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Inventory Report */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Inventory Report</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#10B981" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
