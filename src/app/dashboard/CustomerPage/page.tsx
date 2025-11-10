"use client";
import { useEffect, useState } from "react";

interface UserAccount {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phone_number: number;
}

export function UserAccounts() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    phone_number: "",
  });

  useEffect(() => {
    fetch("http://localhost:5043/api/customerAccounts")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
//from here 11/03
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting form...", formData);
      const res = await fetch("http://localhost:5043/api/customerAccounts/create-customer-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
      setIsModalOpen(false);
      setFormData({ email: "", username: "", firstname: "", lastname: "" , password: "", phone_number: "",});
      // Refresh list
      const updated = await fetch("http://localhost:5043/api/customerAccounts").then(r => r.json());
      setUsers(updated);
      }

      // Refresh list
      //const updated = await fetch("http://localhost:5043/api/customerAccounts").then((r) => r.json());
      //setUsers(updated);
      //setIsModalOpen(false);
      //setFormData({ firstname: "", lastname: "", email: "", username: "", password: "", phone_number: "",});
    } catch (error) {
      console.error(error);
    }
  };
//to here whole upthere^^
  const handleUpdate = async (id: number) => {
    const updatedData = {
      email: prompt("New email:") || undefined,
      username: prompt("New username:") || undefined,
      firstname: prompt("New firstname:") || undefined,
      lastname: prompt("New lastname:") || undefined,
      phone_number: prompt("New Phone Number:") || undefined,
      password: prompt("New password:") || undefined
    };

  const res = await fetch(`http://localhost:5043/api/customerAccounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData)
  });

    if (res.ok) {
      const updated = await fetch("http://localhost:5043/api/customerAccounts").then(r => r.json());
      setUsers(updated);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    const res = await fetch(`http://localhost:5043/api/customerAccounts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const updated = await fetch("http://localhost:5043/api/customerAccounts").then(r => r.json());
      setUsers(updated);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800">User Accounts</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          + Add User
        </button>
      </div>

      {/* User List */}
      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="border p-3 rounded hover:bg-gray-50 transition text-gray-800"
          >
            <p>
              <span className="font-semibold">Name:</span> {u.firstname}{" "}
              {u.lastname}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {u.email}
            </p>
            <p>
              <span className="font-semibold">Username:</span> {u.username}
            </p>
            <p>
              <span className="font-semibold">PhoneNumber:</span> {u.phone_number}
            </p>

            <div className="mt-2 flex gap-2">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                onClick={() => handleUpdate(u.id)}
              >
                Edit
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
              onClick={() => handleDelete(u.id)}
              >   
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New User</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <input
                type="text" // Use type="tel" for better mobile keyboard support
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number} // Ensure it handles undefined if formData is new
                onChange={handleChange}
                className="border p-2 w-full rounded"
                // You can add 'required' if the phone number is mandatory
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <div>
      <h1 className="text-gray-800 text-2xl font-bold">Customers</h1>
      <p className="text-gray-600 mt-2">List of Customers.</p>
      <UserAccounts />
    </div>
  );
}
