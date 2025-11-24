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
      return res.json().catch(() => []); // prevent JSON crash
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

  return (
    <div className="p-6 space-y-6 text-gray-800">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Job Order</h1>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-md"
          onClick={() => setShowModal(true)}
        >
          + Add Service
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Mechanic</th>
            </tr>
          </thead>

          <tbody>
            {types.map((t) => (
              <tr key={t.maintenanceId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{t.maintenanceName}</td>
                <td className="px-4 py-2">{t.description}</td>
                <td className="px-4 py-2">₱{t.basePrice}</td>
                <td className="px-4 py-2">
                  {t.mechanic
                    ? `${t.mechanic.firstname} ${t.mechanic.lastname}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 space-y-4 w-96">

      <h2 className="text-xl font-bold">Add New Service</h2>

      <input
        placeholder="Service Name"
        className="border p-2 rounded w-full"
        onChange={(e) =>
          setNewType({ ...newType, maintenanceName: e.target.value })
        }
      />

      <input
        placeholder="Description"
        className="border p-2 rounded w-full"
        onChange={(e) =>
          setNewType({ ...newType, description: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Base Price"
        className="border p-2 rounded w-full"
        onChange={(e) =>
          setNewType({ ...newType, basePrice: Number(e.target.value) })
        }
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={addMaintenanceType}
      >
        Save
      </button>

    </div>
  </div>
)}

    </div>
  );
}
