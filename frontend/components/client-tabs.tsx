import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  CreditCard,
  ShoppingCart,
  History,
  Clock,
  Package,
  Plus,
  Minus,
  Truck,
} from "lucide-react";
import { InventarioClient } from "./inventario/inventario-client";
import PedidosTable from "./pedidos/pedidos-table";
import { Button } from "@/components/ui/button";
import { Product, Pedido } from "@/types/product";
import React, { useState } from "react";
import OrderDetailsModalCliente from "./order-details-modal-cliente";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EnvioTracking from "@/components/envio-tracking";
import ShipmentTracking from "@/components/shipment-tracking";

interface TabsClienteProps {
  paginatedInventory: Product[];
  totalPages: number;
  page: number;
  setPage: (page: number | ((prevPage: number) => number)) => void;
  handleAddToCart: (product: Product) => void;
  defaultImage: string;
  cart: any[];
  getCartTotal: () => number;
  removeFromCart: (id: string) => void;
  addToCart: (item: any) => void;
  clearCart: () => void;
  handleCheckout: () => void;
  pedidos: any[];
  clientStats: any;
  loading: boolean;
  handleCreateCobroCliente: (pedido: Pedido) => void;
  deletePedido: (pedidoId: number) => Promise<void>;
}

export default function TabsCliente({
  paginatedInventory,
  totalPages,
  page,
  setPage,
  handleAddToCart,
  defaultImage,
  cart,
  getCartTotal,
  removeFromCart,
  addToCart,
  clearCart,
  handleCheckout,
  pedidos,
  clientStats,
  loading,
  handleCreateCobroCliente,
  deletePedido,
}: TabsClienteProps) {
  const [selectedPedido, setSelectedPedido] = useState<any | null>(null);
  const [selectedEnvioPedido, setSelectedEnvioPedido] = useState<any | null>(null);
  const [selectedTrackPedido, setSelectedTrackPedido] = useState<any | null>(null);

  return (
    <Tabs defaultValue="products" className="space-y-6">
      <TabsList>
        <TabsTrigger value="products">Productos</TabsTrigger>
        <TabsTrigger value="cart">Carrito ({cart.length})</TabsTrigger>
        <TabsTrigger value="orders">Mis Pedidos ({pedidos.length})</TabsTrigger>
      </TabsList>
      {/* Productos */}
      <TabsContent value="products">
        <InventarioClient
          paginatedInventory={paginatedInventory}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          handleAddToCart={handleAddToCart}
          defaultImage={defaultImage}
        />
      </TabsContent>
      {/* Carrito */}
      <TabsContent value="cart">
        <Card>
          <CardHeader>
            <CardTitle>Carrito de Compras</CardTitle>
            <CardDescription>
              Revisa tus productos antes de proceder al pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-lg font-bold text-green-600">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="mx-2 font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(item)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${getCartTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="flex-1"
                    >
                      Vaciar Carrito
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Enviar Pedido para Aprobación
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      {/* Pedidos */}
      <TabsContent value="orders">
        <Card>
          <CardHeader>
            <CardTitle>Mis Pedidos</CardTitle>
            <CardDescription>Historial de todos tus pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Estadísticas del cliente */}
            {clientStats.total > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Pedidos</p>
                  <p className="text-xl font-bold">{clientStats.total}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-600">
                    Pendientes de Aprobación
                  </p>
                  <p className="text-xl font-bold text-orange-700">
                    {clientStats.pendientes}
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600">En Procesamiento</p>
                  <p className="text-xl font-bold text-blue-700">
                    {clientStats.procesando}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600">Listos para Pagar</p>
                  <p className="text-xl font-bold text-green-700">
                    {clientStats.listos}
                  </p>
                </div>
              </div>
            )}
            {/* Alerta de pedidos pendientes */}
            {clientStats.pendientes > 0 && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800">
                      {clientStats.pendientes} pedido
                      {clientStats.pendientes > 1 ? "s" : ""} pendiente
                      {clientStats.pendientes > 1 ? "s" : ""} de aprobación
                    </h3>
                    <p className="text-sm text-orange-700">
                      Tu pedido está siendo revisado por el administrador. Te
                      notificaremos cuando sea aprobado.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Cargando pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tienes pedidos aún</p>
              </div>
            ) : (
              <PedidosTable
                pedidos={pedidos}
                onViewOrder={setSelectedPedido}
                onViewEnvio={setSelectedEnvioPedido}
                onTrackPedido={setSelectedTrackPedido}
                onCreateDespacho={() => {}}
                onAvanzarDespacho={async () => {}}
                onCreateCobro={handleCreateCobroCliente}
                onProcesarCobro={async () => {}}
                onDeletePedido={deletePedido}
                isAdmin={false}
              />
            )}
            {/* Modal de detalles del pedido */}
            {selectedPedido && (
              <OrderDetailsModalCliente
                pedido={selectedPedido}
                onClose={() => setSelectedPedido(null)}
              />
            )}
            {/* Modal solo de envío */}
            {selectedEnvioPedido && selectedEnvioPedido.envio && (
              <Dialog open={true} onOpenChange={() => setSelectedEnvioPedido(null)}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      {selectedEnvioPedido.envio.id ? (
                        <>
                          Envío #{selectedEnvioPedido.envio.id}
                        </>
                      ) : (
                        <>Seguimiento del Envío</>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                  <EnvioTracking
                    estado={selectedEnvioPedido.envio.estado}
                    transportista={selectedEnvioPedido.envio.transportista}
                    guiaSeguimiento={selectedEnvioPedido.envio.guiaSeguimiento}
                    fechaEnvio={selectedEnvioPedido.envio.creado_en}
                    fechaActualizacion={selectedEnvioPedido.envio.actualizado_en}
                  />
                  <div className="flex gap-2 pt-4">
                    <button onClick={() => setSelectedEnvioPedido(null)} className="flex-1 border rounded px-4 py-2 bg-gray-50 hover:bg-gray-100">Cerrar</button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
