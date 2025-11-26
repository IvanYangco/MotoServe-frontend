"use client";
import { useEffect, useState } from "react";

export function UserAccounts() {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    Firstname: "",
    Lastname: "",
    Email: "",
    Username: "",
    Password: "",
    PhoneNumber: "",
    Motorcycle: "",
    PlateNumber: "",
  });

  //  Fetch customers
  useEffect(() => {
    fetch("http://localhost:5043/api/customerAccounts")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  //  Handle input change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  CREATE customer
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch(
      "http://localhost:5043/api/customerAccounts/create-customer-account",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) {
      setIsModalOpen(false);
      setFormData({
        Firstname: "",
        Lastname: "",
        Email: "",
        Username: "",
        Password: "",
        PhoneNumber: "",
        Motorcycle: "",
        PlateNumber: "",
      });

      const updated = await fetch(
        "http://localhost:5043/api/customerAccounts"
      ).then((r) => r.json());
      setUsers(updated);
    }
  };

  //  UPDATE customer
  const handleUpdate = async (id: number) => {
    const updatedData = {
      Firstname: prompt("New Firstname:"),
      Lastname: prompt("New Lastname:"),
      Username: prompt("New Username:"),
      Email: prompt("New Email:"),
      Password: prompt("New Password:"),
      PhoneNumber: prompt("New Phone Number:"),
    };

    await fetch(`http://localhost:5043/api/customerAccounts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const updated = await fetch(
      "http://localhost:5043/api/customerAccounts"
    ).then((r) => r.json());
    setUsers(updated);
  };

  //  DELETE customer
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this customer?")) return;

    await fetch(`http://localhost:5043/api/customerAccounts/${id}`, {
      method: "DELETE",
    });

    const updated = await fetch(
      "http://localhost:5043/api/customerAccounts"
    ).then((r) => r.json());
    setUsers(updated);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white/90 text-gray-800 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Customer Accounts</h2>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Customer
        </button>
      </div>

      {/* Customer Table */}
      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Customer ID</th>
            <th className="p-2 border">Lastname</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Motorcycle</th>
            <th className="p-2 border">Plate No.</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-500">
                No customers found.
              </td>
            </tr>
          ) : (
            users.map((u: any) => (
              <tr key={u.id} className="border hover:bg-gray-50 transition">
                <td className="p-2 font-bold text-blue-600">{u.id}</td>
                <td className="p-2">{u.lastname}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.phone_number || "N/A"}</td>
                <td className="p-2">{u.motorcycle || "—"}</td>
                <td className="p-2">{u.plate_number || "—"}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    className="bg-blue-500 px-2 py-1 rounded text-white"
                    onClick={() => handleUpdate(u.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 rounded text-white"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-3">Add Customer</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input name="Firstname" placeholder="First Name" className="input" onChange={handleChange} />
              <input name="Lastname" placeholder="Last Name" className="input" onChange={handleChange} />
              <input name="Username" placeholder="Username" className="input" onChange={handleChange} />
              <input name="Email" type="email" placeholder="Email" className="input" onChange={handleChange} />
              <input name="Password" type="password" placeholder="Password" className="input" onChange={handleChange} />
              <input name="PhoneNumber" placeholder="Phone Number" className="input" onChange={handleChange} />
              <input name="Motorcycle" placeholder="Motorcycle" className="input" onChange={handleChange} />
              <input name="PlateNumber" placeholder="Plate Number" className="input" onChange={handleChange} />

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1 border rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 px-3 py-1 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerPage() {
  return (
    <div
      className="min-h-screen bg-[url('/customerbg.png')] bg-cover bg-center bg-no-repeat p-6"
    >
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow-md">
        Customers
      </h1>
      <UserAccounts />
    </div>
  );
}
