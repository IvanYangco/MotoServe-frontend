"use client";
import { useEffect, useState } from "react";
interface adminAccount {
  id: number;
  email: string;
  username: string;
  firstname: string; 
  lastname: string;
}


export function Admins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: ""
  });

  useEffect(() => {
    fetch("http://localhost:5043/api/adminAccounts")
      .then(res => res.json())
      .then(data => setAdmins(data))
      .catch(err => console.error(err));
  }, []);
  
  // Submit new admin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...", formData);
    const res = await fetch("http://localhost:5043/api/adminAccounts/create-admin-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setShowForm(false);
      setFormData({ email: "", username: "", firstname: "", lastname: "" , password:""});
      // Refresh list
      const updated = await fetch("http://localhost:5043/api/adminAccounts").then(r => r.json());
      setAdmins(updated);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    const res = await fetch(`http://localhost:5043/api/AdminAccounts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const updated = await fetch("http://localhost:5043/api/AdminAccounts").then(r => r.json());
      setAdmins(updated);
    }
  };

  const handleUpdate = async (id: number) => {
    const updatedData = {
      email: prompt("New email:") || undefined,
      username: prompt("New username:") || undefined,
      firstname: prompt("New firstname:") || undefined,
      lastname: prompt("New lastname:") || undefined,
    };

  const res = await fetch(`http://localhost:5043/api/AdminAccounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData)
  });

    if (res.ok) {
      const updated = await fetch("http://localhost:5043/api/AdminAccounts").then(r => r.json());
      setAdmins(updated);
    }
  };
  return (
    <div className="p-4 border rounded-lg mb-6 shadow-sm bg-white text-grey-800">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Admin Accounts</h2>
        <button
          className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded"
          onClick={() => setShowForm(true)}
        >
          + Add Admin
        </button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {admins.map(a => (
          <li key={a.id} className="border p-3 rounded hover:bg-gray-50 transition">
            <p><span className="font-semibold">Name:</span> {a.firstname} {a.lastname}</p>
            <p><span className="font-semibold">Email:</span> {a.email}</p>
            <p><span className="font-semibold">Username:</span> {a.username}</p>

            <div className="mt-2 flex gap-2">
              <button
                className="bg-yellow-500 hover:bg-yellow-800 text-white px-2 py-1 rounded text-sm"
                onClick={() => handleUpdate(a.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded text-sm"
                onClick={() => handleDelete(a.id)}
              >
                Delete
              </button>
            </div>
          </li>
          
        ))}
      </ul>

      {/* Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-3">Add New Admin</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="First Name"
                className="w-full border p-2 rounded"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border p-2 rounded"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Username"
                className="w-full border p-2 rounded"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
                <button>
                  
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserAccessManagementPage() {
  return (
    /*CREATE BUTTON FOR CRUDE CREATE, DELETE, UPDATE*/
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
      <h1 className="text-2xl font-bold mb-6">User Access Management</h1>
      <Admins />
    </div>
  );
}