"use client"
import { useEffect, useState } from "react";
interface UserAccount {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
}
// TODO: Adding customer account -> customer | Customer Motorcycle
export  function UserAccounts() {
  const [users, setUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    fetch("http://localhost:5218/api/customers")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800">User Accounts</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
          + Add User
        </button>
      </div>

      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="border p-3 rounded hover:bg-gray-50 transition"
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

            <div className="mt-2 flex gap-2">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                Edit
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
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