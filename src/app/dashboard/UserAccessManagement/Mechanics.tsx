"use client";
import { useState, useEffect } from "react";

export function Mechanics() {
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    motorExpertise: "",
  });

  // GET
  useEffect(() => {
    fetch("http://localhost:5043/api/Mechanic")
      .then(res => res.json())
      .then(data =>
        setMechanics(
          data.map((m: any) => ({
            mechanicId: m.MechanicId,
            firstname: m.Firstname,
            lastname: m.Lastname,
            phoneNumber: m.PhoneNumber,
            motorExpertise: m.MotorExpertise,
          }))
        )
      );
  }, []);

  // CREATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      alert("Phone number must be exactly 11 digits and contain only numbers.");
      return;
    }

    const res = await fetch("http://localhost:5043/api/Mechanic/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const updated = await fetch("http://localhost:5043/api/Mechanic").then(r => r.json());
    setMechanics(updated);
    setShowForm(false);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5043/api/Mechanic/${id}`, { method: "DELETE" });
    const updated = await fetch("http://localhost:5043/api/Mechanic").then(r => r.json());
    setMechanics(updated);
  };

  // UPDATE
  const handleUpdate = async (id: number) => {
    const updatedData = {
      firstname: prompt("New Firstname:"),
      lastname: prompt("New Lastname:"),
      phoneNumber: prompt("New Phone Number (11 digits):"),
      motorExpertise: prompt("New Expertise:"),
    };

    await fetch(`http://localhost:5043/api/Mechanic/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const updated = await fetch("http://localhost:5043/api/Mechanic").then(r => r.json());
    setMechanics(updated);
  };

  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/UserAccessManagementbg.png')" }} // 🔥 Change if needed
    >
      <div className="p-4 border rounded-lg mb-6 shadow-lg bg-slate-800/40 backdrop-blur-md border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mechanic Accounts</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded" onClick={() => setShowForm(true)}>
            + Add Mechanic
          </button>
        </div>

        <table className="w-full text-left border-collapse text-gray-200">
          <thead className="bg-slate-700/50">
            <tr className="border-b border-white/10">
              <th>Name</th>
              <th>Phone</th>
              <th>Expertise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mechanics.map((m) => (
              <tr key={m.mechanicId} className="border-b border-white/10 hover:bg-slate-700/30 transition">
                <td>{m.firstname} {m.lastname}</td>
                <td>{m.phoneNumber}</td>
                <td>{m.motorExpertise}</td>
                <td className="space-x-2">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded" onClick={() => handleUpdate(m.mechanicId)}>Edit</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded" onClick={() => handleDelete(m.mechanicId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
            <div className="bg-slate-800/60 backdrop-blur-lg p-6 w-96 rounded-lg border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold mb-3 text-gray-200">Add Mechanic</h3>
              <form onSubmit={handleSubmit} className="space-y-2">
                <input className="w-full p-2 border border-gray-300/20 bg-slate-700/40 rounded text-gray-200" placeholder="First Name" onChange={e => setFormData({ ...formData, firstname: e.target.value })} />
                <input className="w-full p-2 border border-gray-300/20 bg-slate-700/40 rounded text-gray-200" placeholder="Last Name" onChange={e => setFormData({ ...formData, lastname: e.target.value })} />
                <input className="w-full p-2 border border-gray-300/20 bg-slate-700/40 rounded text-gray-200" placeholder="Phone Number (11 digits)" maxLength={11} value={formData.phoneNumber} onChange={e => /^\d*$/.test(e.target.value) && setFormData({ ...formData, phoneNumber: e.target.value })} />
                <input className="w-full p-2 border border-gray-300/20 bg-slate-700/40 rounded text-gray-200" placeholder="Motor Expertise" onChange={e => setFormData({ ...formData, motorExpertise: e.target.value })} />

                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="bg-gray-500/50 hover:bg-gray-500/80 px-3 py-1 rounded text-white" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
