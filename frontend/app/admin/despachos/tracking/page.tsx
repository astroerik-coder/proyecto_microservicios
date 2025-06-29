import DespachoTracking from "@/components/despachos/despacho-tracking";
import DespachosNav from "@/components/despachos/despachos-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seguimiento de Despachos - Admin",
  description: "Monitorea el estado de los despachos en tiempo real",
};

export default function DespachoTrackingPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <DespachosNav />
      <DespachoTracking />
    </div>
  );
} 