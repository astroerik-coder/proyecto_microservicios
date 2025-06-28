// app/cliente/page.tsx
"use client";

import WithAuth from "@/components/with-auth";
import ClientDashboard from "@/components/client-dashboard";

export default function ClientePage() {
  return (
    <WithAuth allowedRoles={["CLIENTE"]}>
      <ClientDashboard />
    </WithAuth>
  );
}
