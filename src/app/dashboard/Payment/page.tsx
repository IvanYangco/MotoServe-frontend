"use client";
import { useState } from "react";

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Partial";
}

export default function PaymentPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-001", customer: "Yangco", amount: 69420, status: "Partial" },
    { id: "INV-002", customer: "Baylon", amount: 250, status: "Paid" },
    { id: "INV-003", customer: "Cañete", amount: 67, status: "Unpaid" },
    { id: "INV-004", customer: "Firmanes", amount: 150, status: "Paid" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-500";
      case "Unpaid":
        return "text-red-500";
      case "Partial":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6 text-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Billing & Payment Module</h1>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md shadow">
          + Create Invoice
        </button>
      </div>

      {/* Recent Invoices Section */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-200 px-4 py-3 font-semibold text-gray-700">
          Recent Invoices
        </div>

        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left text-gray-600 text-sm">
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
              <tr
                key={invoice.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{invoice.id}</td>
                <td className="px-4 py-2">{invoice.customer}</td>
                <td className="px-4 py-2">₱{invoice.amount.toLocaleString()}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      invoice.status
                    )}`}
                  ></span>
                  <span>{invoice.status}</span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded">
                    View Details
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded">
                    ✉️ Email Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
