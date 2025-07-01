"use client";

import { CheckCircle, Clock, Package, Truck, CreditCard, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ShipmentTrackingProps {
  estado: "Cancelado" | "Enviado" | "Listo para despachar" | "Listo para pagar" | "Procesando" | "Recibido";
  fechaPedido: string;
  fechaActualizacion?: string;
  cobro?: {
    estado: "PENDIENTE" | "PAGADO" | "FALLIDO";
    monto: number;
    metodoPago: string;
    referenciaPago: string;
  };
}

export default function ShipmentTracking({ estado, fechaPedido, fechaActualizacion, cobro }: ShipmentTrackingProps) {
  const steps = [
    {
      id: "recibido",
      label: "Pedido Recibido",
      description: "Tu pedido ha sido recibido y está siendo procesado",
      icon: Clock,
      status: "completed" as const,
    },
    {
      id: "procesando",
      label: "En Procesamiento",
      description: "Estamos preparando tu pedido",
      icon: Package,
      status: estado === "Recibido" ? "pending" : estado === "Cancelado" ? "cancelled" : "completed",
    },
    {
      id: "listo_despachar",
      label: "Listo para Despachar",
      description: "Tu pedido está listo para ser enviado",
      icon: Truck,
      status: 
        estado === "Recibido" || estado === "Procesando" ? "pending" :
        estado === "Cancelado" ? "cancelled" :
        estado === "Listo para despachar" ? "current" : "completed",
    },
    {
      id: "listo_pagar",
      label: "Listo para Pagar",
      description: "Tu pedido está listo para el pago",
      icon: CreditCard,
      status: 
        estado === "Recibido" || estado === "Procesando" || estado === "Listo para despachar" ? "pending" :
        estado === "Cancelado" ? "cancelled" :
        estado === "Listo para pagar" ? "current" : "completed",
    },
    {
      id: "enviado",
      label: "Enviado",
      description: "Tu pedido está en camino",
      icon: Truck,
      status: 
        estado === "Recibido" || estado === "Procesando" || estado === "Listo para despachar" || estado === "Listo para pagar" ? "pending" :
        estado === "Cancelado" ? "cancelled" :
        estado === "Enviado" ? "current" : "completed",
    },
  ];

  const getStatusColor = (status: "completed" | "current" | "pending" | "cancelled") => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "current":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending":
        return "text-gray-400 bg-gray-50 border-gray-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-400 bg-gray-50 border-gray-200";
    }
  };

  const getIconColor = (status: "completed" | "current" | "pending" | "cancelled") => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "current":
        return "text-blue-600";
      case "pending":
        return "text-gray-400";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
    }> = {
      "Recibido": { label: "Recibido", variant: "secondary" },
      "Procesando": { label: "Procesando", variant: "default" },
      "Listo para despachar": { label: "Listo para despachar", variant: "outline" },
      "Listo para pagar": { label: "Listo para pagar", variant: "outline" },
      "Enviado": { label: "Enviado", variant: "default" },
      "Cancelado": { label: "Cancelado", variant: "destructive" },
    };

    const config = statusConfig[estado] || statusConfig["Recibido"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCobroStatusBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
      icon: React.ComponentType<{ className?: string }>;
    }> = {
      "PENDIENTE": { 
        label: "Pendiente", 
        variant: "secondary",
        icon: Clock
      },
      "PAGADO": { 
        label: "Pagado", 
        variant: "outline",
        icon: CheckCircle
      },
      "FALLIDO": { 
        label: "Fallido", 
        variant: "destructive",
        icon: XCircle
      },
    };

    const config = statusConfig[estado] || statusConfig["PENDIENTE"];
    const Icon = config.icon;
    return (
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (estado === "Cancelado") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Pedido Cancelado</h3>
            <p className="text-red-600">Este pedido ha sido cancelado</p>
          </div>
        </div>
        <div className="text-sm text-red-700">
          <p><strong>Fecha de pedido:</strong> {formatDate(fechaPedido)}</p>
          {fechaActualizacion && (
            <p><strong>Fecha de cancelación:</strong> {formatDate(fechaActualizacion)}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Seguimiento del Pedido</h3>
        {getStatusBadge(estado)}
      </div>

      <div className="space-y-6">
        {/* Flujo de trabajo visual */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="flex items-start">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${getStatusColor(step.status as "completed" | "current" | "pending" | "cancelled")}`}>
                    {step.status === "completed" ? (
                      <CheckCircle className={`w-5 h-5 ${getIconColor(step.status as "completed" | "current" | "pending" | "cancelled")}`} />
                    ) : step.status === "cancelled" ? (
                      <XCircle className={`w-5 h-5 ${getIconColor(step.status as "completed" | "current" | "pending" | "cancelled")}`} />
                    ) : (
                      <Icon className={`w-5 h-5 ${getIconColor(step.status as "completed" | "current" | "pending" | "cancelled")}`} />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 h-12 ml-5 ${
                      step.status === "completed" ? "bg-green-200" : 
                      step.status === "cancelled" ? "bg-red-200" : "bg-gray-200"
                    }`} />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className={`font-medium ${
                    step.status === "completed" ? "text-green-800" :
                    step.status === "current" ? "text-blue-800" :
                    step.status === "cancelled" ? "text-red-800" : "text-gray-500"
                  }`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm ${
                    step.status === "completed" ? "text-green-600" :
                    step.status === "current" ? "text-blue-600" :
                    step.status === "cancelled" ? "text-red-600" : "text-gray-400"
                  }`}>
                    {step.description}
                  </p>
                  {step.status === "current" && (
                    <p className="text-xs text-blue-500 mt-1">
                      En progreso...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Información del cobro si existe */}
        {cobro && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Estado del Pago
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado:</span>
                {getCobroStatusBadge(cobro.estado)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monto:</span>
                <span className="text-sm font-medium">${cobro.monto.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Método:</span>
                <span className="text-sm font-medium capitalize">{cobro.metodoPago}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Referencia:</span>
                <span className="text-sm font-medium">{cobro.referenciaPago}</span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="text-sm text-gray-600">
            <p><strong>Fecha de pedido:</strong> {formatDate(fechaPedido)}</p>
            {fechaActualizacion && (
              <p><strong>Última actualización:</strong> {formatDate(fechaActualizacion)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 