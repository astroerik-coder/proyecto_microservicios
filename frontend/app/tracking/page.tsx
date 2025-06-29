"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, AlertCircle } from "lucide-react";
import { pedidosAPI } from "@/lib/api";
import { Pedido } from "@/types/product";
import ShipmentTracking from "@/components/shipment-tracking";
import AlertModal from "@/components/alert-modal";

export default function TrackingPage() {
  const [pedidoId, setPedidoId] = useState("");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const handleSearch = async () => {
    if (!pedidoId.trim()) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "Por favor ingresa un número de pedido válido.",
      });
      return;
    }

    setLoading(true);
    try {
      const pedidoData = await pedidosAPI.getPedidoById(parseInt(pedidoId));
      setPedido(pedidoData);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Pedido no encontrado",
        message: "No se encontró un pedido con ese número. Verifica el ID e intenta de nuevo.",
      });
      setPedido(null);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seguimiento de Pedidos
          </h1>
          <p className="text-gray-600">
            Ingresa el número de tu pedido para ver su estado actual
          </p>
        </div>

        {/* Buscador */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Pedido
            </CardTitle>
            <CardDescription>
              Ingresa el número de pedido que recibiste en tu confirmación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Ej: 123"
                value={pedidoId}
                onChange={(e) => setPedidoId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultado del tracking */}
        {pedido && (
          <div className="space-y-6">
            {/* Información del pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Pedido #{pedido.id}
                </CardTitle>
                <CardDescription>
                  Cliente #{pedido.idCliente} • {formatDate(pedido.fechaPedido)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-green-600">
                      ${pedido.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Productos</p>
                    <p className="text-xl font-bold">
                      {pedido.detalles.length}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="text-lg font-semibold">
                      {pedido.estado}
                    </p>
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Productos del pedido:</h4>
                  {pedido.detalles.map((detalle) => (
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
              </CardContent>
            </Card>

            {/* Shipment Tracking */}
            <ShipmentTracking 
              estado={pedido.estado}
              fechaPedido={pedido.fechaPedido}
              fechaActualizacion={pedido.actualizado_en}
            />
          </div>
        )}

        {/* Estado inicial */}
        {!pedido && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Busca tu pedido
              </h3>
              <p className="text-gray-500">
                Ingresa el número de pedido arriba para ver el seguimiento en tiempo real
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertModal
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />
    </div>
  );
} 