"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Package,
  LogOut,
  Plus,
  Minus,
  CreditCard,
  History,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { useCart } from "@/hooks/use-cart";
import PaymentModal from "@/components/payment-modal";
import AlertModal from "@/components/alert-modal";
import { useInventory } from "@/hooks/use-inventory";
import { InventarioClient } from "./inventario/inventario-client";
import { Product, PedidoRequest } from "@/types/product";
import Link from "next/link";
import PedidosTable from "@/components/pedidos/pedidos-table";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const { pedidos, loading, createPedido, deletePedido } = useOrders();
  const { inventory } = useInventory();
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal } =
    useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { registerUpdateCallback, updateSpecificPedido } = useRealtimeUpdates();

  const defaultImage = useMemo(
    () =>
      "https://th.bing.com/th/id/R.8940118f857ce3fd71c9d3f00f4f0a08?rik=0NG1bhIGlikxFA&riu=http%3a%2f%2fcelestinomartinez.com%2fwp-content%2fuploads%2f2015%2f01%2festrategia-de-producto.jpg&ehk=cDoGRfIAAkkIl4gzKnP4vCvKuk9YocMDGSCmVcoM%2bww%3d&risl=&pid=ImgRaw&r=0",
    []
  );

  // Adaptador para asegurar compatibilidad con la interfaz Product
  const adaptedInventory = inventory.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    stock: item.stock,
    precio: item.precio,
    eliminado: item.eliminado || false,
    descripcion: item.descripcion || "", // Valor por defecto si es undefined
    creado_en: item.creado_en,
    actualizado_en: item.actualizado_en,
  }));

  const paginatedInventory = adaptedInventory.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(adaptedInventory.length / pageSize);

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart({
        ...product,
        // Mapeo de nombres para compatibilidad con el carrito
        id: product.id?.toString() || "",
        name: product.nombre,
        price: product.precio,
        quantity: 1,
        sku: product.id?.toString() || "",
      });
      setAlert({
        show: true,
        type: "success",
        title: "Producto Agregado",
        message: `${product.nombre} ha sido agregado al carrito.`,
      });
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setAlert({
        show: true,
        type: "error",
        title: "Carrito Vacío",
        message: "Agrega productos al carrito antes de proceder al pago.",
      });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Crear el pedido con los datos del carrito
      const pedidoData: PedidoRequest = {
        idCliente: user?.id || 0,
        total: getCartTotal(),
        lineas: cart.map((item) => ({
          idProducto: parseInt(item.id),
          cantidad: item.quantity,
          precioUnitario: item.price,
        })),
      };

      await createPedido(pedidoData);
      
      // Limpiar carrito después de crear el pedido
      clearCart();
      
      setAlert({
        show: true,
        type: "success",
        title: "Pedido Enviado",
        message: "Tu pedido ha sido enviado y está pendiente de aprobación por el administrador.",
      });
      
      setShowPayment(false);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo enviar el pedido. Inténtalo de nuevo.",
      });
    }
  };

  const handleDeletePedido = async (pedidoId: number) => {
    try {
      await deletePedido(pedidoId);
      setAlert({
        show: true,
        type: "success",
        title: "Pedido Eliminado",
        message: "El pedido ha sido eliminado exitosamente.",
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo eliminar el pedido.",
      });
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

    const config = statusConfig[estado] ?? statusConfig["Recibido"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
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

  // Calcular estadísticas del cliente
  const clientStats = useMemo(() => {
    // Validar que pedidos sea un array
    if (!Array.isArray(pedidos)) {
      return {
        total: 0,
        pendientes: 0,
        procesando: 0,
        listos: 0,
        enviados: 0,
      };
    }

    const totalPedidos = pedidos.length;
    const pedidosPendientes = pedidos.filter(p => p.estado === "PENDIENTE_APROBACION").length;
    const pedidosProcesando = pedidos.filter(p => p.estado === "Procesando").length;
    const pedidosListos = pedidos.filter(p => p.estado === "Listo para pagar").length;
    const pedidosEnviados = pedidos.filter(p => p.estado === "Enviado").length;

    return {
      total: totalPedidos,
      pendientes: pedidosPendientes,
      procesando: pedidosProcesando,
      listos: pedidosListos,
      enviados: pedidosEnviados,
    };
  }, [pedidos]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tienda Online
                </h1>
                <p className="text-sm text-gray-500">
                  Bienvenido, {user?.nombreUsuario}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Carrito ({cart.length})
                </Button>
              </div>
              <Link href="/tracking">
                <Button variant="outline" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Seguimiento
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="cart">Carrito ({cart.length})</TabsTrigger>
            <TabsTrigger value="orders">Mis Pedidos ({pedidos.length})</TabsTrigger>
          </TabsList>

          {/* Componente de Inventario */}
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
                            <p className="text-sm text-gray-500">
                              SKU: {item.sku}
                            </p>
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

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Mis Pedidos</CardTitle>
                <CardDescription>
                  Historial de todos tus pedidos
                </CardDescription>
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
                      <p className="text-sm text-orange-600">Pendientes de Aprobación</p>
                      <p className="text-xl font-bold text-orange-700">{clientStats.pendientes}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600">En Procesamiento</p>
                      <p className="text-xl font-bold text-blue-700">{clientStats.procesando}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600">Listos para Pagar</p>
                      <p className="text-xl font-bold text-green-700">{clientStats.listos}</p>
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
                          {clientStats.pendientes} pedido{clientStats.pendientes > 1 ? 's' : ''} pendiente{clientStats.pendientes > 1 ? 's' : ''} de aprobación
                        </h3>
                        <p className="text-sm text-orange-700">
                          Tu pedido está siendo revisado por el administrador. Te notificaremos cuando sea aprobado.
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
                    onViewOrder={() => {}}
                    onCreateDespacho={() => {}}
                    onAvanzarDespacho={async () => {}}
                    onCreateCobro={() => {}}
                    onProcesarCobro={async () => {}}
                    onDeletePedido={deletePedido}
                    isAdmin={false}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales */}
      {showPayment && (
        <PaymentModal
          total={getCartTotal()}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

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
