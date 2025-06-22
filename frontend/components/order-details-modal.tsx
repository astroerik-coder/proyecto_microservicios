"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, User, Calendar, DollarSign } from "lucide-react"

interface OrderDetailsModalProps {
  order: any
  onClose: () => void
  onStatusUpdate: (orderId: string, status: string) => void
}

export default function OrderDetailsModal({ order, onClose, onStatusUpdate }: OrderDetailsModalProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      processing: { label: "Procesando", variant: "default" as const },
      ready_to_ship: { label: "Listo para Envío", variant: "outline" as const },
      shipped: { label: "Enviado", variant: "default" as const },
      completed: { label: "Completado", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    }

    const config = statusConfig[status] || statusConfig.pending

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Detalles del Pedido #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-green-600">${order.total.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  {getStatusBadge(order.status)}
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
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {item.quantity} x ${item.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">${(item.quantity * item.price).toLocaleString()}</p>
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
            {order.status === "pending" && (
              <Button
                onClick={() => {
                  onStatusUpdate(order.id, "processing")
                  onClose()
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Procesar Pedido
              </Button>
            )}
            {order.status === "processing" && (
              <Button
                onClick={() => {
                  onStatusUpdate(order.id, "ready_to_ship")
                  onClose()
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Marcar Listo
              </Button>
            )}
            {order.status === "ready_to_ship" && (
              <Button
                onClick={() => {
                  onStatusUpdate(order.id, "shipped")
                  onClose()
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Enviar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
