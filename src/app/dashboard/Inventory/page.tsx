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
    <div className="p-6 space-y-6 text-gray-800">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
          onClick={() => setShowModal(true)}
        >
          + Add Material
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Total Profit</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item.material}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">₱{item.price}</td>
                <td className="px-4 py-2 text-green-600 font-semibold">
                  ₱{item.totalProfit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Inventory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">

            <h2 className="text-xl font-bold">Add Inventory Item</h2>

            <input
              placeholder="Material"
              className="border p-2 rounded w-full"
              onChange={(e) =>
                setNewItem({ ...newItem, material: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Quantity"
              className="border p-2 rounded w-full"
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: Number(e.target.value) })
              }
            />

            <input
              type="number"
              placeholder="Price"
              className="border p-2 rounded w-full"
              onChange={(e) =>
                setNewItem({ ...newItem, price: Number(e.target.value) })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded"
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
