"use client";
import { useState, useEffect } from "react";

export function Mechanics() {
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
  firstname: "",      // CHANGED
  lastname: "",       // CHANGED
  phoneNumber: "",    // CHANGED
  motorExpertise: "", // CHANGED
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

  const res = await fetch("http://localhost:5043/api/Mechanic/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const created = await res.json();  
  console.log("Created mechanic:", created);  // 👀 Check mechanicId here

  // Fetch updated list
  const updated = await fetch("http://localhost:5043/api/Mechanic").then(r => r.json());
setMechanics(
  updated.map((m: any) => ({
    mechanicId: m.MechanicId,
    firstname: m.Firstname,
    lastname: m.Lastname,
    phoneNumber: m.PhoneNumber,
    motorExpertise: m.MotorExpertise,
  }))
);

};


// DELETE
const handleDelete = async (id: number) => {
  await fetch(`http://localhost:5043/api/Mechanic/${id}`, {  // FIXED
    method: "DELETE",
  });

  const updated = await fetch("http://localhost:5043/api/Mechanic").then(r => r.json());
  setMechanics(updated);
};

// UPDATE
const handleUpdate = async (id: number) => {
  const updatedData = {
    firstname: prompt("New Firstname:"),
    lastname: prompt("New Lastname:"),
    phoneNumber: prompt("New Phone Number:"),
    motorExpertise: prompt("New Expertise:"),
  };

  await fetch(`http://localhost:5043/api/Mechanic/${id}`, {  // FIXED
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  const updated = await fetch("http://localhost:5043/api/Mechanic").then(r => r.json());
  setMechanics(updated);
};


  return (
    <div className="p-4 border rounded-lg mb-6 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Mechanic Accounts</h2>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setShowForm(true)}>
          + Add Mechanic
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th>Name</th><th>Phone</th><th>Expertise</th><th>Actions</th>
          </tr>
        </thead>
       <tbody>
  {mechanics.map((m, index) => (
    <tr key={m.mechanicId || index}>
      <td>{m.firstname}</td>
      <td>{m.phoneNumber}</td>
      <td>{m.motorExpertise}</td>
      <td className="space-x-2">
        <button className="bg-yellow-500 text-white px-2 py-1 rounded"
          onClick={() => handleUpdate(m.mechanicId)}>
          Edit
        </button>
        <button className="bg-red-600 text-white px-2 py-1 rounded"
          onClick={() => handleDelete(m.mechanicId)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>


      </table>


      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-3">Add Mechanic</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input placeholder="First Name" onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
              <input placeholder="Last Name" onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
              <input placeholder="Phone Number" onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
              <input placeholder="Motor Expertise" onChange={(e) => setFormData({ ...formData, motorExpertise: e.target.value })} />




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
