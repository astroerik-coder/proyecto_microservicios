"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Trash2,
  Play,
  CreditCard,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { PedidoCompleto } from "@/types/product";
import OrderDetailsModal from "@/components/order-details-modal";
import AlertModal from "@/components/alert-modal";
import { InventarioTab } from "@/components/inventario/inventario-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import PedidosTable from "@/components/pedidos/pedidos-table";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import CobrosTable from "@/components/cobros/cobros-table";
import EnviosTable from "@/components/envios/envios-table";
import CrearEnvioModal from "@/components/envios/crear-envio-modal";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { 
    pedidosCompletos, 
    loading, 
    createDespacho, 
    avanzarDespacho, 
    createCobro, 
    procesarCobro,
    marcarCobroFallido,
    updatePedidoEstado,
    deletePedido,
    approvePedido,
  } = useOrders();
  
  const [selectedOrder, setSelectedOrder] = useState<PedidoCompleto | null>(null);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const [showDespachoModal, setShowDespachoModal] = useState(false);
  const [showCobroModal, setShowCobroModal] = useState(false);
  const [selectedPedidoForAction, setSelectedPedidoForAction] = useState<PedidoCompleto | null>(null);
  const [despachoData, setDespachoData] = useState({ observacion: "" });
  const [cobroData, setCobroData] = useState({
    monto: 0,
    metodoPago: "TARJETA",
    referenciaPago: "",
    datosPago: {}
  });

  const { registerUpdateCallback, updateSpecificPedido, updateDespachos, updateCobros, updateStats } = useRealtimeUpdates();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    readyToDispatch: 0,
    readyToPay: 0,
    shippedOrders: 0,
    totalRevenue: 0,
  });

  const [showCrearEnvio, setShowCrearEnvio] = useState(false);
  const [despachoIdParaEnvio, setDespachoIdParaEnvio] = useState<number | null>(null);

  // Actualizar stats solo cuando cambie algo relevante
  useEffect(() => {
    function updateStatsFromPedidos() {
      setStats({
        totalOrders: pedidosCompletos.length,
        pendingOrders: pedidosCompletos.filter((p) => p.estado === "Recibido").length,
        processingOrders: pedidosCompletos.filter((p) => p.estado === "Procesando").length,
        readyToDispatch: pedidosCompletos.filter((p) => p.estado === "Listo para despachar").length,
        readyToPay: pedidosCompletos.filter((p) => p.estado === "Listo para pagar").length,
        shippedOrders: pedidosCompletos.filter((p) => p.estado === "Enviado").length,
        totalRevenue: pedidosCompletos.reduce((sum, pedido) => sum + pedido.total, 0),
      });
    }
    updateStatsFromPedidos();
    const unregister = registerUpdateCallback('stats', updateStatsFromPedidos);
    return () => unregister();
  }, [pedidosCompletos, registerUpdateCallback]);

  // Calcular estadísticas
  const statsMemo = useMemo(() => {
    // Validar que pedidosCompletos sea un array
    if (!Array.isArray(pedidosCompletos)) {
      return {
        total: 0,
        pendientes: 0,
        procesando: 0,
        listos: 0,
        enviados: 0,
      };
    }

    const totalPedidos = pedidosCompletos.length;
    const pedidosPendientes = pedidosCompletos.filter(p => p.estado === "PENDIENTE_APROBACION").length;
    const pedidosProcesando = pedidosCompletos.filter(p => p.estado === "Procesando").length;
    const pedidosListos = pedidosCompletos.filter(p => p.estado === "Listo para despachar").length;
    const pedidosEnviados = pedidosCompletos.filter(p => p.estado === "Enviado").length;

    return {
      total: totalPedidos,
      pendientes: pedidosPendientes,
      procesando: pedidosProcesando,
      listos: pedidosListos,
      enviados: pedidosEnviados,
    };
  }, [pedidosCompletos]);

  const getStatusBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
      icon: React.ElementType;
    }> = {
      "Recibido": {
        label: "Recibido",
        variant: "secondary",
        icon: Clock,
      },
      "Procesando": {
        label: "Procesando",
        variant: "default",
        icon: Package,
      },
      "Listo para despachar": {
        label: "Listo para despachar",
        variant: "outline",
        icon: Truck,
      },
      "Listo para pagar": {
        label: "Listo para pagar",
        variant: "outline",
        icon: CreditCard,
      },
      "Enviado": {
        label: "Enviado",
        variant: "default",
        icon: CheckCircle,
      },
      "Cancelado": {
        label: "Cancelado",
        variant: "destructive",
        icon: XCircle,
      },
    };

    const config = statusConfig[estado] || statusConfig["Recibido"];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
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
    }> = {
      "PENDIENTE": { label: "Pendiente", variant: "secondary" },
      "PAGADO": { label: "Pagado", variant: "outline" },
      "FALLIDO": { label: "Fallido", variant: "destructive" },
    };

    const config = statusConfig[estado] || statusConfig["PENDIENTE"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleStatusUpdate = async (pedidoId: number, newStatus: string) => {
    try {
      await updatePedidoEstado(pedidoId, newStatus);
      setAlert({
        show: true,
        type: "success",
        title: "Estado Actualizado",
        message: `El pedido ${pedidoId} ha sido actualizado exitosamente.`,
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

  const handleCreateDespacho = async () => {
    if (!selectedPedidoForAction) return;
    
    try {
      await createDespacho(selectedPedidoForAction.id, despachoData.observacion);
      setShowDespachoModal(false);
      setDespachoData({ observacion: "" });
      setSelectedPedidoForAction(null);
      setAlert({
        show: true,
        type: "success",
        title: "Despacho Creado",
        message: "El despacho ha sido creado exitosamente.",
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo crear el despacho.",
      });
    }
  };

  const handleAvanzarDespacho = async (despachoId: number) => {
    try {
      await avanzarDespacho(despachoId);
      setAlert({
        show: true,
        type: "success",
        title: "Despacho Avanzado",
        message: "El estado del despacho ha sido avanzado exitosamente.",
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo avanzar el despacho.",
      });
    }
  };

  const handleCreateCobro = async () => {
    if (!selectedPedidoForAction) return;
    
    try {
      await createCobro(
        selectedPedidoForAction.id, 
        cobroData.monto, 
        cobroData.metodoPago, 
        cobroData.referenciaPago,
        cobroData.datosPago
      );
      setShowCobroModal(false);
      setCobroData({ monto: 0, metodoPago: "TARJETA", referenciaPago: "", datosPago: {} });
      setSelectedPedidoForAction(null);
      setAlert({
        show: true,
        type: "success",
        title: "Cobro Creado",
        message: "El cobro ha sido creado exitosamente.",
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo crear el cobro.",
      });
    }
  };

  const handleProcesarCobro = async (cobroId: number) => {
    try {
      await procesarCobro(cobroId);
      setAlert({
        show: true,
        type: "success",
        title: "Cobro Procesado",
        message: "El cobro ha sido procesado exitosamente.",
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo procesar el cobro.",
      });
    }
  };

  const handleMarcarCobroFallido = async (cobroId: number) => {
    try {
      await marcarCobroFallido(cobroId);
      setAlert({
        show: true,
        type: "success",
        title: "Cobro Marcado como Fallido",
        message: "El cobro ha sido marcado como fallido exitosamente.",
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo marcar el cobro como fallido.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                  Bienvenido, {user?.nombreUsuario}
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
                Pendientes
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
              <CardTitle className="text-sm font-medium">Listos para Despachar</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.readyToDispatch}
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

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Gestión de Pedidos</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="despachos">Despachos</TabsTrigger>
            <TabsTrigger value="cobros">Cobros</TabsTrigger>
            <TabsTrigger value="envios">Envíos</TabsTrigger>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Pedidos</CardTitle>
                <CardDescription>
                  Administra todos los pedidos de los clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Cargando pedidos...</p>
                  </div>
                ) : pedidosCompletos.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay pedidos para mostrar</p>
                  </div>
                ) : (
                  <PedidosTable
                    pedidos={pedidosCompletos}
                    onViewOrder={setSelectedOrder}
                    onCreateDespacho={(pedido) => {
                      setSelectedPedidoForAction(pedido);
                      setShowDespachoModal(true);
                    }}
                    onAvanzarDespacho={avanzarDespacho}
                    onCreateCobro={(pedido) => {
                      setSelectedPedidoForAction(pedido);
                      setCobroData({ ...cobroData, monto: pedido.total });
                      setShowCobroModal(true);
                    }}
                    onProcesarCobro={procesarCobro}
                    onDeletePedido={deletePedido}
                    onApprovePedido={approvePedido}
                    isAdmin={true}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <InventarioTab />
          </TabsContent>

          <TabsContent value="despachos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Gestión de Despachos
                </CardTitle>
                <CardDescription>
                  Administra y controla el estado de los despachos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Gestión Completa</h3>
                          <p className="text-sm text-gray-600">Administra todos los despachos</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Crea, edita y gestiona el estado de los despachos con una interfaz completa y detallada.
                      </p>
                      <Link href="/admin/despachos">
                        <Button className="w-full">
                          Ir a Gestión
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Truck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Seguimiento Visual</h3>
                          <p className="text-sm text-gray-600">Monitorea en tiempo real</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Visualiza el progreso de los despachos con un diseño moderno y actualizaciones en tiempo real.
                      </p>
                      <Link href="/admin/despachos/tracking">
                        <Button className="w-full" variant="outline">
                          Ver Seguimiento
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Estados de Despacho</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm">PENDIENTE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm">EN_PREPARACION</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm">LISTO_PARA_ENVIO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-sm">FALLIDO</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cobros">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Gestión de Cobros
                </CardTitle>
                <CardDescription>
                  Administra y controla el estado de los cobros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CobrosTable 
                  onProcesarCobro={handleProcesarCobro}
                  onMarcarFallido={handleMarcarCobroFallido}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="envios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Gestión de Envíos
                </CardTitle>
                <CardDescription>
                  Administra y controla el estado de los envíos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnviosTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsMemo.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes de Aprobación</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{statsMemo.pendientes}</div>
                  {statsMemo.pendientes > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Requieren atención inmediata
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Procesamiento</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{statsMemo.procesando}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Listos para Despachar</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{statsMemo.listos}</div>
                </CardContent>
              </Card>
            </div>

            {/* Alerta de pedidos pendientes */}
            {statsMemo.pendientes > 0 && (
              <Card className="mt-4 border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-orange-800">
                        {statsMemo.pendientes} pedido{statsMemo.pendientes > 1 ? 's' : ''} pendiente{statsMemo.pendientes > 1 ? 's' : ''} de aprobación
                      </h3>
                      <p className="text-sm text-orange-700">
                        Revisa la pestaña "Pedidos" para aprobar los pedidos pendientes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
          onProcesarCobro={handleProcesarCobro}
          extraActions={selectedOrder.despacho && !selectedOrder.envio ? (
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                setDespachoIdParaEnvio(selectedOrder.despacho?.id || 0);
                setShowCrearEnvio(true);
              }}
            >
              Crear Envío
            </Button>
          ) : null}
        />
      )}

      {/* Modal de Despacho */}
      <Dialog open={showDespachoModal} onOpenChange={setShowDespachoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Despacho</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observacion">Observación</Label>
              <Input
                id="observacion"
                value={despachoData.observacion}
                onChange={(e) => setDespachoData({ observacion: e.target.value })}
                placeholder="Observaciones del despacho..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDespachoModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateDespacho}>
                Crear Despacho
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Cobro */}
      <Dialog open={showCobroModal} onOpenChange={setShowCobroModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Cobro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="monto">Monto</Label>
              <Input
                id="monto"
                type="number"
                value={cobroData.monto}
                onChange={(e) => setCobroData({ ...cobroData, monto: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="metodoPago">Método de Pago</Label>
              <Select
                value={cobroData.metodoPago}
                onValueChange={(value) => setCobroData({ ...cobroData, metodoPago: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TARJETA">Tarjeta de Crédito/Débito</SelectItem>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferencia Bancaria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="referenciaPago">Referencia de Pago</Label>
              <Input
                id="referenciaPago"
                value={cobroData.referenciaPago}
                onChange={(e) => setCobroData({ ...cobroData, referenciaPago: e.target.value })}
                placeholder="Ej: ticket-123, transfer-456..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCobroModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCobro}>
                Crear Cobro
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para crear envío */}
      {showCrearEnvio && despachoIdParaEnvio && (
        <CrearEnvioModal
          idDespacho={despachoIdParaEnvio}
          open={showCrearEnvio}
          onClose={() => setShowCrearEnvio(false)}
          onSuccess={() => {
            setShowCrearEnvio(false);
            setDespachoIdParaEnvio(null);
            // Recargar pedidos/envíos si es necesario
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
