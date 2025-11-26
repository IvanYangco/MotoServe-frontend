"use client";

import { useState, useEffect } from "react";

export function Admins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  useEffect(() => {
    fetch("http://localhost:5043/api/AdminAccounts")
      .then((res) => res.json())
      .then((data) => setAdmins(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setShowForm(false);
      const res = await fetch("http://localhost:5043/api/AdminAccounts/create-admin-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Backend Error:", error);
      }
      const updated = await fetch("http://localhost:5043/api/AdminAccounts").then((r) => r.json());
      setAdmins(updated);
    } catch (err) {
      console.error("Fetch Failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this admin?")) return;
    await fetch(`http://localhost:5043/api/AdminAccounts/${id}`, { method: "DELETE" });

    const updated = await fetch("http://localhost:5043/api/AdminAccounts").then((r) => r.json());
    setAdmins(updated);
  };

  const handleUpdate = async (id: number) => {
    const updatedData = {
      username: prompt("New Username:"),
      firstname: prompt("New Firstname:"),
      lastname: prompt("New Lastname:"),
      email: prompt("New Email:"),
    };

    await fetch(`http://localhost:5043/api/AdminAccounts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const updated = await fetch("http://localhost:5043/api/AdminAccounts").then((r) => r.json());
    setAdmins(updated);
  };

  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center text-gray-200"
      style={{ backgroundImage: "url('/UserAccessManagementbg.png')" }} // 🔥 change filename if needed
    >
      <div className="p-4 border rounded-lg mb-6 shadow-lg bg-slate-800/40 backdrop-blur-md border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Admin Accounts</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-md"
            onClick={() => setShowForm(true)}
          >
            + Add Admin
          </button>
        </div>

        <table className="w-full text-left border-collapse text-gray-200">
          <thead className="bg-slate-700/50">
            <tr className="border-b border-white/10">
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Username</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-b border-white/10 hover:bg-slate-700/30 transition">
                <td>{a.firstname} {a.lastname}</td>
                <td>{a.email}</td>
                <td>{a.username}</td>
                <td className="space-x-2">
                 <button
  onClick={() => handleUpdate(a.id)}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
>
  Edit
</button>
              
<button
  onClick={() => handleDelete(a.id)}
  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
>
  Delete
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
            <div className="bg-slate-800/60 backdrop-blur-lg p-6 w-96 rounded-lg border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold mb-3 text-gray-200">Add Admin</h3>
              <form onSubmit={handleSubmit} className="space-y-2">
                <input className="w-full border border-gray-300/20 bg-slate-700/40 p-2 rounded text-gray-200" placeholder="First Name"
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
                <input className="w-full border border-gray-300/20 bg-slate-700/40 p-2 rounded text-gray-200" placeholder="Last Name"
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
                <input className="w-full border border-gray-300/20 bg-slate-700/40 p-2 rounded text-gray-200" placeholder="Username"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                <input className="w-full border border-gray-300/20 bg-slate-700/40 p-2 rounded text-gray-200" placeholder="Email" type="email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input className="w-full border border-gray-300/20 bg-slate-700/40 p-2 rounded text-gray-200" placeholder="Password" type="password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="bg-gray-500/50 hover:bg-gray-500/80 px-3 py-1 rounded text-white"
                    onClick={() => setShowForm(false)}>Cancel</button>
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
