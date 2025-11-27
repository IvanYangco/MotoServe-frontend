"use client";
import { useEffect, useState } from "react";

interface MaintenanceType {
  maintenanceId: number;
  maintenanceName: string;
  description: string;
  basePrice: number;
  mechanic: {
    mechanicId: number;
    firstname: string;
    lastname: string;
    expertise: string;
  } | null;
}

interface Mechanics {
  mechanicId: number;
  firstname: string;
  lastname: string;
}

export default function MaintenanceTypePage() {
  const [types, setTypes] = useState<MaintenanceType[]>([]);
  const [mechanics, setMechanics] = useState<Mechanics[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [newType, setNewType] = useState({
    maintenanceName: "",
    description: "",
    basePrice: 0,
    mechanicId: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5043/api/MaintenanceType")
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json().catch(() => []);
      })
      .then((data) => setTypes(data));

    fetch("http://localhost:5043/api/Mechanics")
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json().catch(() => []);
      })
      .then((data) => setMechanics(data));
  }, []);

  const addMaintenanceType = async () => {
    await fetch("http://localhost:5043/api/MaintenanceType", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newType),
    });
    setShowModal(false);
    location.reload();
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<MaintenanceType | null>(null);


  return (
    <div
      className="p-6 space-y-6 min-h-screen bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/joborderbg.png')" }}
    >
      {/* Header */}
      <div className="flex justify-between bg-slate-800/40 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-md">
        <h1 className="text-3xl font-bold">Job Order</h1>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white px-5 py-2 rounded-md shadow-md transition"
          onClick={() => setShowModal(true)}
        >
          + Add Service
        </button>
      </div>

 {/* Table */}
<div className="bg-slate-800/40 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-white/10">
  <table className="min-w-full table-auto text-gray-200">
    <thead className="bg-slate-700/50 text-gray-300">
  <tr>
    <th className="px-4 py-2 w-1/4 text-left">Service</th>
    <th className="px-4 py-2 w-1/2 text-left">Description</th>
    <th className="px-4 py-2 w-1/4 text-left">Price</th>
    <th className="px-4 py-2 text-center">Actions</th>
  </tr>
</thead>

    <tbody>
      {types.map((t) => (
        <tr key={t.maintenanceId} className="border-t border-white/10 hover:bg-slate-700/30 transition">
          <td className="px-4 py-2">{t.maintenanceName}</td>
          <td className="px-4 py-2">{t.description}</td>
          <td className="px-4 py-2">₱{t.basePrice}</td>

          {/* 🆕 ACTION BUTTONS */}
          <td className="px-4 py-2 text-center">
  <div className="flex justify-center gap-2">
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      onClick={() => {
        setEditItem(t);
        setShowEditModal(true);
      }}
    >
      Edit
    </button>

    <button
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this service?")) {
                    await fetch(`http://localhost:5043/api/MaintenanceType/${t.maintenanceId}`, {
                      method: "DELETE",
                    });
                    location.reload();
                  }
                }}
              >
                Delete
              </button>
  </div>
</td>


        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div className="bg-slate-800/60 backdrop-blur-lg rounded-lg p-6 space-y-4 w-96 border border-white/10 shadow-xl">
      <h2 className="text-xl font-bold">Add New Service</h2>

      <input
        placeholder="Service Name"
        className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200 placeholder-gray-400"
        onChange={(e) =>
          setNewType({ ...newType, maintenanceName: e.target.value })
        }
      />

      <input
        placeholder="Description"
        className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200 placeholder-gray-400"
        onChange={(e) =>
          setNewType({ ...newType, description: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Base Price"
        className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200 placeholder-gray-400"
        onChange={(e) =>
          setNewType({ ...newType, basePrice: Number(e.target.value) })
        }
      />

      {/* BUTTONS */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          className="px-4 py-2 border border-gray-400/40 rounded hover:bg-gray-600/30 transition"
          onClick={() => setShowModal(false)}
        >
          Back
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
          onClick={addMaintenanceType}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
{/* EDIT MODAL */}
{showEditModal && editItem && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div className="bg-slate-800/60 backdrop-blur-lg rounded-lg p-6 space-y-4 w-96 border border-white/10 shadow-xl">
      <h2 className="text-xl font-bold">Edit Service</h2>

      <input
        defaultValue={editItem.maintenanceName}
        className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200"
        onChange={(e) => setEditItem({ ...editItem, maintenanceName: e.target.value })}
      />

      <input
        defaultValue={editItem.description}
        className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200"
        onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
      />

      <input
        type="number"
        defaultValue={editItem.basePrice}
        className="border border-gray-400/20 bg-slate-700/40 p-2 rounded w-full text-gray-200"
        onChange={(e) => setEditItem({ ...editItem, basePrice: Number(e.target.value) })}
      />

      {/* BUTTONS */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          className="px-4 py-2 border border-gray-400/40 rounded hover:bg-gray-600/30 transition"
          onClick={() => setShowEditModal(false)}
        >
          Back
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
          onClick={async () => {
            await fetch(`http://localhost:5043/api/MaintenanceType/${editItem.maintenanceId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(editItem),
            });
            setShowEditModal(false);
            location.reload();
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
