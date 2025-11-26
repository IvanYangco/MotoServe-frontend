"use client";
import { useState, useEffect } from "react";

interface InventoryItem {
  id: number;
  material: string;
  quantity: number;
  price: number;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    material: "",
    quantity: 0,
    price: 0,
  });
  const [editModal, setEditModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  // LOAD DATA
  useEffect(() => {
    fetch("http://localhost:5043/api/Inventory")
      .then((res) => res.json())
      .then((data) => setInventory(data));
  }, []);

  // CREATE ITEM
  const createInventoryItem = async () => {
    await fetch("http://localhost:5043/api/Inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    setShowModal(false);
    location.reload();
  };

  // DELETE ITEM
  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    await fetch(`http://localhost:5043/api/Inventory/${id}`, {
      method: "DELETE",
    });

    location.reload();
  };

  // UPDATE QUANTITY (PUT API)
  const updateQuantity = async (id: number, newQty: number) => {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;

    const updatedItem = { ...item, quantity: newQty };

    await fetch(`http://localhost:5043/api/Inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem)
    });

    location.reload();
  };

  return (
    <div
      className="min-h-screen p-6 space-y-6 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/inventorybg.png')" }}
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
              <th className="px-4 py-2 text-left">Material</th>
              <th className="px-4 py-2 text-center">Quantity</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.id}
                className="border-t border-white/10 hover:bg-slate-700/30 transition"
              >
                <td className="px-4 py-2 text-left">{item.material}</td>

                {/* QUANTITY WITH + - BUTTON */}
                <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="bg-slate-600 hover:bg-slate-500 px-2 rounded"
                  >
                    -
                  </button>
                  <span className="font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-slate-600 hover:bg-slate-500 px-2 rounded"
                  >
                    +
                  </button>
                </td>

                {/* RIGHT ALIGN PRICE — GREEN TEXT */}
                <td className="px-4 py-2 text-right font-semibold text-green-400">
                  ₱{item.price.toLocaleString()}
                </td>

                {/* ACTION BUTTONS */}
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                    onClick={() => {
                      setEditItem(item);
                      setEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS BELOW... (REMAIN THE SAME) */}
      {/* ... */}

    </div>
  );
}
