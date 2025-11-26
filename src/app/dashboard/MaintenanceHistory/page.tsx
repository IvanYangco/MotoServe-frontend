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
  const [loading, setLoading] = useState(false);

  const autoGenerate = async () => {
  try {
    const res = await fetch("http://localhost:5043/api/MaintenanceHistory/auto", {
      method: "POST"
    });

    const data = await res.json();
    alert(data.message);
    fetchHistory(); // Refresh table
  } catch (err) {
    alert("❌ Failed to auto-generate history");
    console.error(err);
  }
};


  // 🔥 FUNCTION TO LOAD DATA ON BUTTON CLICK
 const fetchHistory = async () => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5043/api/MaintenanceHistory");
    const data = await res.json();

    const formatted = data.map((item: any) => ({
      historyId: item.HistoryId,
      customer: item.Customer,
      motorcycle: item.Motorcycle,
      service: item.Service,
      mechanic: item.Mechanic,
      date: item.Date,
      time: item.Time,
      amount: item.Amount,
    }));
    setHistory(formatted);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
  }
  setLoading(false);
};
const deleteHistory = async (id: number) => {
  if (!confirm("Are you sure you want to delete this history?")) return;

  try {
    const res = await fetch(`http://localhost:5043/api/MaintenanceHistory/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);
    fetchHistory(); // refresh table automatically
  } catch (err) {
    console.error("❌ Failed to delete history:", err);
    alert("Failed to delete history.");
  }
};



  return (
    <div
      className="min-h-screen p-6 space-y-6 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/maintenancebg.png')" }} 
    >
      {/* Header */}
      <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Maintenance History</h1>

        </div>
      
      {/* 🔽 BUTTONS */}
<div className="space-x-2">
  <button onClick={fetchHistory} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
    {loading ? "Loading..." : "Load History"}
  </button>

  <button onClick={() => window.location.reload()} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
    Refresh Page
  </button>

  {/* 🆕 ADD THIS BUTTON */}
<button
  onClick={autoGenerate}
  className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
>
  + Add New
</button>

</div>


      {/* Table */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-white/10">
        <table className="min-w-full table-auto text-gray-200">
         <thead className="bg-slate-700/50 text-gray-300">
  <tr>
    <th className="px-4 py-2 text-left">Customer</th>
    <th className="px-4 py-2 text-left">Motorcycle</th>
    <th className="px-4 py-2 text-left">Service</th>
    <th className="px-4 py-2 text-left">Mechanic</th>
    <th className="px-4 py-2 text-center">Date & Time</th>
    <th className="px-4 py-2 text-right">Amount</th>
    <th className="px-4 py-2 text-center">Action</th>
  </tr>
</thead>

          <tbody>
  {history.length > 0 ? (
    history.map((h, index) => (
      <tr
        key={h.historyId ?? index}
        className="border-t border-white/10 hover:bg-slate-700/30 transition"
      >
        <td className="px-4 py-2 text-left">{h.customer}</td>
        <td className="px-4 py-2 text-left">{h.motorcycle}</td>
        <td className="px-4 py-2 text-left">{h.service}</td>
        <td className="px-4 py-2 text-left">{h.mechanic}</td>
        <td className="px-4 py-2 text-center">{h.date} {h.time}</td>

        {/* ⭐ RIGHT ALIGN AMOUNT */}
        <td className="px-4 py-2 text-right">
          ₱{Number(h.amount || 0).toLocaleString()}
        </td>

        {/* 🗑 DELETE BUTTON */}
        <td className="px-4 py-2 text-center">
          <button
            onClick={() => deleteHistory(h.historyId)}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={7} className="text-center p-4 text-gray-400">
        No history found. Click **Fetch History** to load.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
