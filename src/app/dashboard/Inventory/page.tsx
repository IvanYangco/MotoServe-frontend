"use client";
import { useState, useEffect } from "react";

interface InventoryItem {
  id: number;
  material: string;
  quantity: number;
  price: number;
  totalProfit: number;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    material: "",
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5043/api/Inventory")
      .then((res) => res.json())
      .then((data) => setInventory(data));
  }, []);

  const createInventoryItem = async () => {
    await fetch("http://localhost:5043/api/Inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    setShowModal(false);
    location.reload();
  };

  return (
    <div
      className="min-h-screen p-6 space-y-6 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/inventorybg.png')" }} // 🔥 change filename if needed
    >
      {/* HEADER */}
      <div className="flex justify-between bg-slate-800/40 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-lg">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-md transition"
          onClick={() => setShowModal(true)}
        >
          + Add Material
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-white/10">
        <table className="min-w-full table-auto text-gray-200">
          <thead className="bg-slate-700/50 text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Total Profit</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.id}
                className="border-t border-white/10 hover:bg-slate-700/30 transition"
              >
                <td className="px-4 py-2">{item.material}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">₱{item.price}</td>
                <td className="px-4 py-2 text-green-400 font-semibold">
                  ₱{item.totalProfit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-800/60 backdrop-blur-lg p-6 w-96 rounded-lg border border-white/10 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-gray-200">Add Inventory Item</h2>

            <input
              placeholder="Material"
              className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200 placeholder-gray-400"
              onChange={(e) =>
                setNewItem({ ...newItem, material: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Quantity"
              className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200 placeholder-gray-400"
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: Number(e.target.value) })
              }
            />

            <input
              type="number"
              placeholder="Price"
              className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200 placeholder-gray-400"
              onChange={(e) =>
                setNewItem({ ...newItem, price: Number(e.target.value) })
              }
            />

            <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-500/20">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500/50 hover:bg-gray-500/80 text-white px-4 py-1 rounded transition"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition"
                onClick={createInventoryItem}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
