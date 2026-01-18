"use client";

import React from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminProvider from "@/provider/AdminProvider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProvider>
      <main>
        <AdminNavbar />
        {children}
      </main>
    </AdminProvider>
  );
}
