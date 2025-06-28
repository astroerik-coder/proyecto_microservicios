// app/admin/page.tsx
"use client";

import WithAuth from "@/components/with-auth";
import AdminDashboard from "@/components/admin-dashboard";

export default function AdminPage() {
  return (
    <WithAuth allowedRoles={["ADMIN"]}>
      <AdminDashboard />
    </WithAuth>
  );
}
