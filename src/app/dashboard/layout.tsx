"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Function to add highlight class when active
  const linkClass = (path: string) =>
    `${pathname === path ? "bg-cyan-600 text-white" : "text-gray-300"} 
     p-2 rounded block`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-3">
        <h2 className="text-xl font-bold mb-6">MotoServe</h2>

        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
          <Link href="/dashboard/InteractiveMotorDesign" className={linkClass("/dashboard/InteractiveMotorDesign")}>Motorcycle Customization</Link>
          <Link href="/dashboard/Appointment" className={linkClass("/dashboard/Appointment")}>Appointment</Link>
          <Link href="/dashboard/CustomerPage" className={linkClass("/dashboard/CustomerPage")}>Customer</Link>
          <Link href="/dashboard/Inventory" className={linkClass("/dashboard/Inventory")}>Inventory</Link>
          <Link href="/dashboard/JobOrder" className={linkClass("/dashboard/JobOrder")}>Job Order</Link>
          <Link href="/dashboard/MaintenanceHistory" className={linkClass("/dashboard/MaintenanceHistory")}>Maintenance</Link>
          <Link href="/dashboard/Payment" className={linkClass("/dashboard/Payment")}>Payment</Link>
          <Link href="/dashboard/Report" className={linkClass("/dashboard/Report")}>Report</Link>
          <Link href="/dashboard/UserAccessManagement" className={linkClass("/dashboard/UserAccessManagement")}>User Access Management</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
