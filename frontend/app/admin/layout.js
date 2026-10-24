"use client";
import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 flex flex-col flex-1">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="w-full pt-16 flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
