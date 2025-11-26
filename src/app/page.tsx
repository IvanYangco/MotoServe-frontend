"use client";
import Image from "next/image";
import Link from "next/link";

/*
  THIS IS LOGIN PAGE

  TODO
  TODO: Customer Information
  TODO: Maintenacne History
  TODO: Repair Scheduling & Appointment
  TODO: Job Order Management
  TODO: Parts and Inventory Management
  TODO: Billing and Payment module
  TODO: Report and Analytics
  TODO: Inerative Motor parts customization
  TODO: Import / export data
  TODO: User Access manaement
*/

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('loginbg3.png')" }}
    >
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/00"></div>

      {/* Main content */}
      <div className="relative z-10  rounded-xl shadow-md text-center">
        {/* <h1 className="text-whites-800 text-3xl font-bold mb-4">
          Welcome to MotoServe
        </h1> */}

        <p className="text-white-600 mb-8 text-center">
          Manage motorcycle maintenance, job orders, and inventory easily.
        </p>

        <Link
          href="/dashboard"
          className="px-6 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-700 transition"
        >
          Go to Dashboard
        </Link>
        
      </div>
    </main>
  );
}