"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { useCart } from "@/hooks/use-cart";
import PaymentModal from "@/components/payment-modal";
import AlertModal from "@/components/alert-modal";
import { useInventory } from "@/hooks/use-inventory";
import { InventarioClient } from "./inventario/inventario-client";
import { Product, PedidoRequest } from "@/types/product";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { Pedido } from "@/types/product";
import CartSummaryModal from "@/components/cart-summary-modal";
import HeaderCliente from "@/components/client-header";
import TabsCliente from "@/components/client-tabs";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const { pedidos, loading, createPedido, deletePedido, createCobro, procesarCobro } =
    useOrders();
  const { inventory } = useInventory();
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal } =
    useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentPedido, setPaymentPedido] = useState<Pedido | null>(null);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { registerUpdateCallback, updateSpecificPedido } = useRealtimeUpdates();
  const [showCartSummary, setShowCartSummary] = useState(false);

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
    setShowCartSummary(true);
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
        message:
          "Tu pedido ha sido enviado y está pendiente de aprobación por el administrador.",
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
    const statusConfig: Record<
      string,
      {
        label: string;
        variant: "secondary" | "default" | "outline" | "destructive";
      }
    > = {
      Recibido: { label: "Recibido", variant: "secondary" },
      Procesando: { label: "Procesando", variant: "default" },
      "Listo para despachar": {
        label: "Listo para despachar",
        variant: "outline",
      },
      "Listo para pagar": { label: "Listo para pagar", variant: "outline" },
      Enviado: { label: "Enviado", variant: "default" },
      Cancelado: { label: "Cancelado", variant: "destructive" },
    };

    const config = statusConfig[estado] ?? statusConfig["Recibido"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
    const pedidosPendientes = pedidos.filter(
      (p) => p.estado === "PENDIENTE_APROBACION"
    ).length;
    const pedidosProcesando = pedidos.filter(
      (p) => p.estado === "Procesando"
    ).length;
    const pedidosListos = pedidos.filter(
      (p) => p.estado === "Listo para pagar"
    ).length;
    const pedidosEnviados = pedidos.filter(
      (p) => p.estado === "Enviado"
    ).length;

    return {
      total: totalPedidos,
      pendientes: pedidosPendientes,
      procesando: pedidosProcesando,
      listos: pedidosListos,
      enviados: pedidosEnviados,
    };
  }, [pedidos]);

  // Función para el cliente: pagar un pedido 'Listo para pagar'
  const handleCreateCobroCliente = (pedido: Pedido) => {
    setPaymentPedido(pedido);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderCliente user={user} cartLength={cart.length} onLogout={logout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabsCliente
          paginatedInventory={paginatedInventory}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          handleAddToCart={handleAddToCart}
          defaultImage={defaultImage}
          cart={cart}
          getCartTotal={getCartTotal}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          clearCart={clearCart}
          handleCheckout={handleCheckout}
          pedidos={pedidos}
          clientStats={clientStats}
          loading={loading}
          handleCreateCobroCliente={handleCreateCobroCliente}
          deletePedido={handleDeletePedido}
        />
      </div>
      {/* Modales */}
      {showCartSummary && (
        <CartSummaryModal
          cart={cart}
          total={getCartTotal()}
          onClose={() => setShowCartSummary(false)}
          onConfirm={handlePaymentSuccess}
        />
      )}
      {showPayment && (
        <PaymentModal
          total={paymentPedido ? paymentPedido.total : getCartTotal()}
          onClose={() => {
            setShowPayment(false);
            setPaymentPedido(null);
          }}
          onSuccess={async (referenciaPago, metodoPago) => {
            if (paymentPedido) {
              // Crear cobro para el pedido existente
              try {
                // Crear el cobro y obtener la respuesta con el ID
                const cobroCreado = await createCobro(
                  paymentPedido.id,
                  paymentPedido.total,
                  metodoPago || "EFECTIVO",
                  referenciaPago || `REF-${Date.now()}-${paymentPedido.id}`,
                  {}
                );

                // Procesar el cobro automáticamente usando el ID devuelto
                if (cobroCreado && cobroCreado.id) {
                  await procesarCobro(cobroCreado.id);
                }

                setAlert({
                  show: true,
                  type: "success",
                  title: "Pago realizado",
                  message: "El pago se ha procesado correctamente.",
                });
              } catch (error) {
                setAlert({
                  show: true,
                  type: "error",
                  title: "Error",
                  message: "No se pudo procesar el pago.",
                });
              }
              setShowPayment(false);
              setPaymentPedido(null);
            } else {
              // Flujo original: crear pedido desde el carrito
              await handlePaymentSuccess();
            }
          }}
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
