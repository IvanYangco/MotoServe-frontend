"use client";
import { useState, useEffect } from "react";

interface Invoice {
  id: number;
  invoice: string;
  customer: string;
  amount: number;
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  due: string;
}

interface PaymentForm {
  invoice: string;
  amount: number;
  paymentStatus: string;
  due: string;
  customerId: number | null;
  maintenanceId: number | null;
}

export default function PaymentPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<PaymentForm>({
    invoice: "",
    amount: 0.0,
    paymentStatus: "Unpaid",
    due: "",
    customerId: null,
    maintenanceId: null,
  });

  // 🔹 Load payments
  useEffect(() => {
    fetch("http://localhost:5043/api/PaymentApi")
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  // 🔹 Submit invoice
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      invoice: formData.invoice,
      amount: formData.amount,
      paymentStatus: formData.paymentStatus,
      due: formData.due,
      customerId: formData.customerId,
      maintenanceId: formData.maintenanceId,
    };

    try {
      const res = await fetch("http://localhost:5043/api/PaymentApi/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("❌ Backend Error:", error);
        return;
      }

      setShowModal(false);
      const refreshed = await fetch("http://localhost:5043/api/PaymentApi").then((r) => r.json());
      setInvoices(refreshed);
    } catch (err) {
      console.error("❌ Fetch Failed:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-400";
      case "Unpaid":
        return "text-red-400";
      case "Partial":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      className="min-h-screen p-6 space-y-6 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/paymentbg.png')" }} // 🔥 change filename if needed
    >
      {/* Header */}
      <div className="text-center bg-slate-800/40 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Billing & Payment Module</h1>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md shadow-md transition"
          onClick={() => setShowModal(true)}
        >
          + Create Invoice
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg border border-white/10 overflow-hidden">
        <div className="bg-slate-700/50 px-4 py-3 font-semibold text-gray-200">
          Recent Invoices
        </div>

        <table className="min-w-full table-auto text-gray-200">
          <thead className="bg-slate-700/50 text-left text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-2">Invoice ID</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Amount Due</th>
              <th className="px-4 py-2">Payment Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-white/10 hover:bg-slate-700/30 transition">
                <td className="px-4 py-2">{invoice.invoice}</td>
                <td className="px-4 py-2">{invoice.customer}</td>
                <td className="px-4 py-2">₱{invoice.amount.toLocaleString()}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(invoice.paymentStatus)}`} />
                  <span>{invoice.paymentStatus}</span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded">
                    Edit
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-slate-800/60 backdrop-blur-lg rounded-lg p-6 w-96 border border-white/10 shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-gray-200">Create New Invoice</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="border border-gray-400/20 bg-slate-700/40 p-2 w-full rounded text-gray-200 placeholder-gray-400"
                placeholder="Invoice ID (e.g., INV-001)"
                onChange={(e) => setFormData({ ...formData, invoice: e.target.value })}
              />

              <input
                className="border border-gray-400/20 bg-slate-700/40 p-2 w-full rounded text-gray-200 placeholder-gray-400"
                type="number"
                placeholder="Customer ID"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
              />

              <input
                className="border border-gray-400/20 bg-slate-700/40 p-2 w-full rounded text-gray-200 placeholder-gray-400"
                type="number"
                placeholder="Amount"
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
              />

              <input
                className="border border-gray-400/20 bg-slate-700/40 p-2 w-full rounded text-gray-200 placeholder-gray-400"
                type="date"
                onChange={(e) => setFormData({ ...formData, due: e.target.value })}
              />

              <select
                className="border border-gray-400/20 bg-slate-700/40 p-2 w-full rounded text-gray-200"
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
              </select>

              <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-500/20">
                <button
                  type="button"
                  className="bg-gray-500/50 hover:bg-gray-500/80 text-white px-3 py-1 rounded transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition">
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
