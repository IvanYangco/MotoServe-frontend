import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-3">
        <h2 className="text-xl font-bold mb-6">MotoServe</h2>

        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/Appointment">Appointment</Link>
          <Link href="/dashboard/CustomerPage">Customer</Link>
          <Link href="/dashboard/Inventory">Inventory</Link>
          <Link href="/dashboard/JobOrder">Job Order</Link>
          <Link href="/dashboard/MaintenanceHistory">Maintenance</Link>
          <Link href="/dashboard/Payment">Payment</Link>
          <Link href="/dashboard/Report">Report</Link>
          <Link href="/dashboard/UserAccessManagement">UserAccessManagement</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}