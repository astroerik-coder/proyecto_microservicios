"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import OrderDetailsModal from "@/components/order-details-modal";
import AlertModal from "@/components/alert-modal";
import { InventarioTab } from "@/components/inventario/inventario-table";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    completedOrders: orders.filter((o) => o.status === "completed").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  type OrderStatus =
    | "pending"
    | "processing"
    | "ready_to_ship"
    | "shipped"
    | "completed"
    | "cancelled";

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
      icon: React.ElementType;
    }> = {
      pending: {
        label: "Pendiente",
        variant: "secondary",
        icon: Clock,
      },
      processing: {
        label: "Procesando",
        variant: "default",
        icon: Package,
      },
      ready_to_ship: {
        label: "Listo para Envío",
        variant: "outline",
        icon: CheckCircle,
      },
      shipped: { label: "Enviado", variant: "default", icon: Truck },
      completed: {
        label: "Completado",
        variant: "default",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelado",
        variant: "destructive",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig["pending"];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setAlert({
        show: true,
        type: "success",
        title: "Estado Actualizado",
        message: `El pedido ${orderId} ha sido actualizado exitosamente.`,
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo actualizar el estado del pedido.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel Administrativo
                </h1>
                <p className="text-sm text-gray-500">
                  Bienvenido, {user?.name}
                </p>
              </div>
            </div>
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pedidos
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pedidos Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pendingOrders}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedOrders}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Gestión de Pedidos</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
          </TabsList>
          {/* Pedido */}
          {/*  <PedidosTab /> */}
          {/* Inventario */}
          <InventarioTab />
        </Tabs>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <AlertModal
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() =>
          setAlert({ show: false, type: "", title: "", message: "" })
        }
      />
    </div>
  );
}
