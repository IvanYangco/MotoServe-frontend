"use client";
import { useEffect, useState } from "react";

interface History {
  historyId: number;
  customer: string;
  motorcycle: string;
  service: string;
  mechanic: string;
  date: string;
  time: string;
  amount: number;
}

export default function MaintenanceHistoryPage() {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    fetch("http://localhost:5043/api/MaintenanceHistory")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  return (
    <div
      className="min-h-screen p-6 space-y-6 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/maintenancebg.png')" }} // 🔥 change filename if needed
    >
      {/* Header */}
      <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold">Maintenance History</h1>
      </div>

      {/* Table */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-white/10">
        <table className="min-w-full table-auto text-gray-200">
          <thead className="bg-slate-700/50 text-gray-300">
            <tr>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Motorcycle</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Mechanic</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr
                key={h.historyId}
                className="border-t border-white/10 hover:bg-slate-700/30 transition"
              >
                <td className="px-4 py-2">{h.customer}</td>
                <td className="px-4 py-2">{h.motorcycle}</td>
                <td className="px-4 py-2">{h.service}</td>
                <td className="px-4 py-2">{h.mechanic}</td>
                <td className="px-4 py-2">
                  {h.date} {h.time}
                </td>
                <td className="px-4 py-2">₱{h.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
