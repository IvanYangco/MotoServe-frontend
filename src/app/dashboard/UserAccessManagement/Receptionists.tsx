"use client";
import { useState, useEffect } from "react";

export function Receptionists() {
  const [receptionists, setReceptionists] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  // Get receptionist accounts from API
  useEffect(() => {
    fetch("http://localhost:5043/api/ReceptionistAccounts")
      .then((res) => res.json())
      .then((data) => setReceptionists(data));
  }, []);

  // Create new account
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:5043/api/ReceptionistAccounts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setShowForm(false);
    setFormData({ email: "", username: "", firstname: "", lastname: "", password: "" });

    const updated = await fetch("http://localhost:5043/api/ReceptionistAccounts").then((r) => r.json());
    setReceptionists(updated);
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this receptionist?")) return;
    await fetch(`http://localhost:5043/api/ReceptionistAccounts/${id}`, { method: "DELETE" });

    const updated = await fetch("http://localhost:5043/api/ReceptionistAccounts").then((r) => r.json());
    setReceptionists(updated);
  };

  // Edit
  const handleUpdate = async (id: number) => {
    const updatedData = {
      username: prompt("New Username:"),
      firstname: prompt("New Firstname:"),
      lastname: prompt("New Lastname:"),
      email: prompt("New Email:"),
    };

    await fetch(`http://localhost:5043/api/ReceptionistAccounts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const updated = await fetch("http://localhost:5043/api/ReceptionistAccounts").then((r) => r.json());
    setReceptionists(updated);
  };

  return (
    <div className="p-4 border rounded-lg mb-6 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Receptionist Accounts</h2>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setShowForm(true)}>
          + Add Receptionist
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th>Name</th><th>Email</th><th>Username</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {receptionists.map((r) => (
            <tr key={r.id} className="border-b">
              <td>{r.firstname} {r.lastname}</td>
              <td>{r.email}</td>
              <td>{r.username}</td>
              <td className="space-x-2">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleUpdate(r.id)}>Edit</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-3">Add Receptionist</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input className="w-full border p-2 rounded" placeholder="First Name" onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Last Name" onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Email" type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Password" type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
