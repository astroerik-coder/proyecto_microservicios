"use client";

import { CheckCircle, Truck, XCircle, Undo2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnvioTrackingProps {
  estado: "EN_TRANSITO" | "ENTREGADO" | "DEVUELTO" | "CANCELADO";
  transportista?: string;
  guiaSeguimiento?: string;
  fechaEnvio?: string;
  fechaActualizacion?: string;
}

const estados = [
  {
    id: "en_transito",
    label: "En Tránsito",
    icon: Truck,
    estado: "EN_TRANSITO",
    color: "text-blue-600",
  },
  {
    id: "entregado",
    label: "Entregado",
    icon: CheckCircle,
    estado: "ENTREGADO",
    color: "text-green-600",
  },
  {
    id: "devuelto",
    label: "Devuelto",
    icon: Undo2,
    estado: "DEVUELTO",
    color: "text-yellow-600",
  },
  {
    id: "cancelado",
    label: "Cancelado",
    icon: XCircle,
    estado: "CANCELADO",
    color: "text-red-600",
  },
];

function getStepStatus(current: string, step: string) {
  if (current === step) return "current";
  if (current === "ENTREGADO" && step === "EN_TRANSITO") return "completed";
  if (current === "DEVUELTO" && (step === "EN_TRANSITO")) return "completed";
  if (current === "CANCELADO" && (step === "EN_TRANSITO")) return "completed";
  return "pending";
}

export default function EnvioTracking({ estado, transportista, guiaSeguimiento, fechaEnvio, fechaActualizacion }: EnvioTrackingProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Seguimiento del Envío</h3>
        <Badge variant="outline">{estado.replace("_", " ")}</Badge>
      </div>
      <div className="flex items-center justify-between w-full mb-8">
        {estados.map((step, idx) => {
          const status = getStepStatus(estado, step.estado);
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 mb-2
                ${status === "completed" ? "border-green-500 bg-green-50" : ""}
                ${status === "current" ? step.color + " border-2 border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}
                ${status === "pending" ? "border-gray-200 bg-gray-50" : ""}
                ${status === "cancelled" ? "border-red-500 bg-red-50" : ""}
              `}>
                <Icon className={`w-6 h-6 ${status === "current" ? step.color : status === "completed" ? "text-green-600" : "text-gray-400"}`} />
              </div>
              <span className={`text-xs font-medium ${status === "current" ? step.color : status === "completed" ? "text-green-600" : "text-gray-400"}`}>{step.label}</span>
              {idx < estados.length - 1 && (
                <div className={`h-1 w-full ${status === "completed" ? "bg-green-400" : "bg-gray-200"}`}></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transportista && (
          <div>
            <span className="text-sm text-gray-500">Transportista:</span>
            <div className="font-semibold">{transportista}</div>
          </div>
        )}
        {guiaSeguimiento && (
          <div>
            <span className="text-sm text-gray-500">Guía de Seguimiento:</span>
            <div className="font-mono">{guiaSeguimiento}</div>
          </div>
        )}
        {fechaEnvio && (
          <div>
            <span className="text-sm text-gray-500">Fecha de Envío:</span>
            <div>{new Date(fechaEnvio).toLocaleString("es-ES")}</div>
          </div>
        )}
        {fechaActualizacion && (
          <div>
            <span className="text-sm text-gray-500">Última Actualización:</span>
            <div>{new Date(fechaActualizacion).toLocaleString("es-ES")}</div>
          </div>
        )}
      </div>
    </div>
  );
} 