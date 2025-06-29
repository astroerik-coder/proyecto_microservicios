"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, User, Calendar, DollarSign } from "lucide-react"
import { PedidoCompleto } from "@/types/product"
import AdminShipmentTracking from "./admin-shipment-tracking"
import { useEffect, useState } from "react"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"

interface OrderDetailsModalProps {
  order: PedidoCompleto
  onClose: () => void
  onStatusUpdate: (orderId: number, status: string) => void
}

export default function OrderDetailsModal({ order, onClose, onStatusUpdate }: OrderDetailsModalProps) {
  const [pedido, setPedido] = useState(order)
  const { registerUpdateCallback } = useRealtimeUpdates()

  useEffect(() => {
    setPedido(order)
    const unregister = registerUpdateCallback(`pedido-${order.id}`, () => {
      setPedido({ ...pedido })
    })
    return () => unregister()
  }, [order, registerUpdateCallback])

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
    }

    const config = statusConfig[estado] || statusConfig["Recibido"]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Detalles del Pedido #{pedido.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Shipment Tracking Completo */}
          <AdminShipmentTracking pedido={pedido} />

          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-semibold">Cliente #{pedido.idCliente}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold">{formatDate(pedido.fechaPedido)}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-green-600">${pedido.total.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  {getStatusBadge(pedido.estado)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pedido.detalles.map((detalle) => (
                  <div key={detalle.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-semibold">{detalle.nombreProducto}</p>
                      <p className="text-sm text-gray-500">ID: {detalle.idProducto}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {detalle.cantidad} x ${detalle.precioUnitario.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">${detalle.subtotal.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cerrar
            </Button>
            {pedido.estado === "PENDIENTE_APROBACION" && (
              <Button
                onClick={() => {
                  onStatusUpdate(pedido.id, "Procesando")
                  onClose()
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Aprobar Pedido
              </Button>
            )}
            {pedido.estado === "Recibido" && (
              <Button
                onClick={() => {
                  onStatusUpdate(pedido.id, "Procesando")
                  onClose()
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Procesar Pedido
              </Button>
            )}
            {pedido.estado === "Procesando" && (
              <Button
                onClick={() => {
                  onStatusUpdate(pedido.id, "Listo para despachar")
                  onClose()
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Marcar Listo para Despachar
              </Button>
            )}
            {pedido.estado === "Listo para despachar" && (
              <Button
                onClick={() => {
                  onStatusUpdate(pedido.id, "Listo para pagar")
                  onClose()
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Marcar Listo para Pagar
              </Button>
            )}
            {pedido.estado === "Listo para pagar" && (
              <Button
                onClick={() => {
                  onStatusUpdate(pedido.id, "Enviado")
                  onClose()
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Marcar Enviado
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
