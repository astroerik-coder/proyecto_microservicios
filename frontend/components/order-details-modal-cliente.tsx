import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader as CardHeaderUI, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Eye } from "lucide-react";
import { Pedido } from "@/types/product";
import { useState } from "react";
import ShipmentTracking from "@/components/shipment-tracking";
import EnvioTracking from "@/components/envio-tracking";

// Tracking visual para el cliente usando el mismo componente que el tracking general
function TrackingModalCliente({ pedido, onClose }: { pedido: Pedido; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Seguimiento del Pedido #{pedido.id}
          </DialogTitle>
        </DialogHeader>
        <ShipmentTracking
          estado={pedido.estado as "Recibido" | "Procesando" | "Listo para despachar" | "Listo para pagar" | "Enviado" | "Cancelado"}
          fechaPedido={pedido.fechaPedido}
          fechaActualizacion={pedido.actualizado_en}
        />
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface OrderDetailsModalClienteProps {
  pedido: Pedido;
  onClose: () => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailsModalCliente({ pedido, onClose }: OrderDetailsModalClienteProps) {
  const [showTracking, setShowTracking] = useState(false);
  const [showEnvioTracking, setShowEnvioTracking] = useState(false);
  // Simulación: obtener info de envío desde pedido.envio (ajusta según tu modelo real)
  const envio = (pedido as any).envio;
  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Pedido #{pedido.id}
            </DialogTitle>
          </DialogHeader>
          <Card>
            <CardHeaderUI>
              <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
              <CardDescription>
                Fecha: {formatDate(pedido.fechaPedido)}<br />
                Estado: <Badge>{pedido.estado}</Badge><br />
                Total: <span className="text-2xl font-bold text-green-600">${pedido.total.toLocaleString()}</span>
              </CardDescription>
            </CardHeaderUI>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <h4 className="font-medium text-gray-900">Productos del pedido:</h4>
                {pedido.detalles && pedido.detalles.map((detalle) => (
                  <div
                    key={detalle.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{detalle.nombreProducto}</p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {detalle.cantidad} x ${detalle.precioUnitario}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${detalle.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cerrar
                </Button>
                <Button onClick={() => setShowTracking(true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Ver Seguimiento
                </Button>
                {envio && (
                  <Button onClick={() => setShowEnvioTracking(true)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ver Envío</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      {showTracking && (
        <TrackingModalCliente pedido={pedido} onClose={() => setShowTracking(false)} />
      )}
      {showEnvioTracking && envio && (
        <Dialog open={true} onOpenChange={() => setShowEnvioTracking(false)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Seguimiento del Envío
              </DialogTitle>
            </DialogHeader>
            <EnvioTracking
              estado={envio.estado}
              transportista={envio.transportista}
              guiaSeguimiento={envio.guiaSeguimiento}
              fechaEnvio={envio.creado_en}
              fechaActualizacion={envio.actualizado_en}
            />
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEnvioTracking(false)} className="flex-1">
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 