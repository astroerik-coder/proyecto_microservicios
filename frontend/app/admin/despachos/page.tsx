import DespachosDashboard from "@/components/despachos/despachos-dashboard";
import DespachosNav from "@/components/despachos/despachos-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Despachos - Admin",
  description: "Administra y controla el estado de los despachos",
};

export default function DespachosPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <DespachosNav />
      <DespachosDashboard />
    </div>
  );
} 