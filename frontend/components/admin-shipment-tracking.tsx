"use client";

import { Package, Truck, CreditCard, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PedidoCompleto } from "@/types/product";

interface AdminShipmentTrackingProps {
  pedido: PedidoCompleto;
  onProcesarCobro?: (cobroId: number) => Promise<void>;
}

export default function AdminShipmentTracking({ pedido, onProcesarCobro }: AdminShipmentTrackingProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
    }> = {
      "PENDIENTE_APROBACION": { label: "Pendiente de Aprobación", variant: "secondary" },
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

  const getDespachoStatusBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
    }> = {
      "PENDIENTE": { label: "Pendiente", variant: "secondary" },
      "EN_PROCESO": { label: "En Proceso", variant: "default" },
      "LISTO_PARA_ENVIO": { label: "Listo para Envío", variant: "outline" },
      "ENVIADO": { label: "Enviado", variant: "default" },
      "ENTREGADO": { label: "Entregado", variant: "default" },
    };

    const config = statusConfig[estado] || statusConfig["PENDIENTE"];
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
        icon: AlertTriangle
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

  const handleProcesarCobro = async (cobroId: number) => {
    if (onProcesarCobro) {
      try {
        await onProcesarCobro(cobroId);
      } catch (error) {
        console.error("Error al procesar cobro:", error);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Seguimiento Completo del Pedido</h3>
        {getStatusBadge(pedido.estado)}
      </div>

      <div className="space-y-6">
        {/* Estado del Pedido */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Estado del Pedido
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Estado Actual:</span>
              {getStatusBadge(pedido.estado)}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Fecha de Pedido:</span>
              <span className="text-sm font-medium">{formatDate(pedido.fechaPedido)}</span>
            </div>
            {pedido.actualizado_en && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Última Actualización:</span>
                <span className="text-sm font-medium">{formatDate(pedido.actualizado_en)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Estado del Despacho */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Estado del Despacho
          </h4>
          {pedido.despacho ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Estado:</span>
                {getDespachoStatusBadge(pedido.despacho.estado)}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">ID Despacho:</span>
                <span className="text-sm font-medium">#{pedido.despacho.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Fecha Creación:</span>
                <span className="text-sm font-medium">{formatDate(pedido.despacho.fechaCreacion)}</span>
              </div>
              {pedido.despacho.observacion && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-600 font-medium">Observación:</span>
                  <p className="text-sm text-blue-700 mt-1">{pedido.despacho.observacion}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">Sin despacho creado</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                El pedido debe estar en estado "Listo para despachar" para crear un despacho
              </p>
            </div>
          )}
        </div>

        {/* Estado del Cobro */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Estado del Cobro
          </h4>
          {pedido.cobro ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Estado:</span>
                {getCobroStatusBadge(pedido.cobro.estado)}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">ID Cobro:</span>
                <span className="text-sm font-medium">#{pedido.cobro.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Monto:</span>
                <span className="text-sm font-medium">${pedido.cobro.monto.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Método:</span>
                <span className="text-sm font-medium capitalize">{pedido.cobro.metodoPago}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Referencia:</span>
                <span className="text-sm font-medium">{pedido.cobro.referenciaPago}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Fecha Creación:</span>
                <span className="text-sm font-medium">{formatDate(pedido.cobro.fechaCreacion)}</span>
              </div>
              
              {/* Botón para procesar cobro si está pendiente */}
              {pedido.cobro.estado === "PENDIENTE" && onProcesarCobro && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">Acción:</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleProcesarCobro(pedido.cobro?.id ?? 0)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Procesar Cobro
                    </Button>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Marca este cobro como procesado para avanzar el estado del pedido
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">Sin cobro creado</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                El pedido debe estar en estado "Listo para pagar" para crear un cobro
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Flujo de trabajo visual */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Flujo de Trabajo</h4>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Recibido</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              pedido.estado === "Recibido" ? "bg-gray-300" : "bg-green-500"
            }`}></div>
            <span>Procesando</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              ["Recibido", "Procesando"].includes(pedido.estado) ? "bg-gray-300" : "bg-green-500"
            }`}></div>
            <span>Despacho</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              ["Recibido", "Procesando", "Listo para despachar"].includes(pedido.estado) ? "bg-gray-300" : "bg-green-500"
            }`}></div>
            <span>Cobro</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              pedido.estado === "Enviado" ? "bg-green-500" : "bg-gray-300"
            }`}></div>
            <span>Enviado</span>
          </div>
        </div>
      </div>
    </div>
  );
} 