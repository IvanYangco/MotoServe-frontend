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
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  return (
    <div className="p-6 text-gray-800 space-y-6">
      <h1 className="text-3xl font-bold">Maintenance History</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
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
            {history.map(h => (
              <tr key={h.historyId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{h.customer}</td>
                <td className="px-4 py-2">{h.motorcycle}</td>
                <td className="px-4 py-2">{h.service}</td>
                <td className="px-4 py-2">{h.mechanic}</td>
                <td className="px-4 py-2">{h.date} {h.time}</td>
                <td className="px-4 py-2">₱{h.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
