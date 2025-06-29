"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  Plus,
  Eye,
  Trash2,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";
import { despachosAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";

interface Despacho {
  id: number;
  idPedido: number;
  estado: string;
  observaciones: string;
  eliminado: boolean;
  creado_en: string;
  actualizado_en: string;
}

export default function DespachosDashboard() {
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDespacho, setSelectedDespacho] = useState<Despacho | null>(null);
  const [newDespacho, setNewDespacho] = useState({
    idPedido: "",
    observaciones: "",
  });
  const { toast } = useToast();
  const { registerUpdateCallback, updateDespachos } = useRealtimeUpdates();
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enPreparacion: 0,
    listosParaEnvio: 0,
    fallidos: 0,
  });

  // Cargar despachos
  const loadDespachos = async () => {
    try {
      setLoading(true);
      const data = await despachosAPI.obtenerTodos();
      setDespachos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los despachos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDespachos();
  }, []);

  useEffect(() => {
    function updateStatsFromDespachos() {
      setStats({
        total: despachos.length,
        pendientes: despachos.filter(d => d.estado === "PENDIENTE").length,
        enPreparacion: despachos.filter(d => d.estado === "EN_PREPARACION").length,
        listosParaEnvio: despachos.filter(d => d.estado === "LISTO_PARA_ENVIO").length,
        fallidos: despachos.filter(d => d.estado === "FALLIDO").length,
      });
    }
    updateStatsFromDespachos();
    const unregister = registerUpdateCallback('despachos', updateStatsFromDespachos);
    return () => unregister();
  }, [despachos, registerUpdateCallback]);

  // Crear nuevo despacho
  const handleCreateDespacho = async () => {
    if (!newDespacho.idPedido) {
      toast({
        title: "Error",
        description: "El ID del pedido es requerido",
        variant: "destructive",
      });
      return;
    }

    try {
      await despachosAPI.crearDespacho({
        idPedido: parseInt(newDespacho.idPedido),
        observaciones: newDespacho.observaciones,
      });
      
      toast({
        title: "Éxito",
        description: "Despacho creado exitosamente",
      });
      
      setShowCreateModal(false);
      setNewDespacho({ idPedido: "", observaciones: "" });
      loadDespachos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el despacho",
        variant: "destructive",
      });
    }
  };

  // Avanzar estado del despacho
  const handleAvanzarEstado = async (id: number) => {
    try {
      await despachosAPI.avanzarEstado(id);
      toast({
        title: "Éxito",
        description: "Estado del despacho actualizado",
      });
      loadDespachos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  // Marcar despacho como fallido
  const handleMarcarFallido = async (id: number) => {
    try {
      await despachosAPI.marcarFallido(id);
      toast({
        title: "Éxito",
        description: "Despacho marcado como fallido",
      });
      loadDespachos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar como fallido",
        variant: "destructive",
      });
    }
  };

  // Reiniciar despacho
  const handleReiniciarDespacho = async (id: number) => {
    try {
      await despachosAPI.reiniciarDespacho(id);
      toast({
        title: "Éxito",
        description: "Despacho reiniciado a estado PENDIENTE",
      });
      loadDespachos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reiniciar el despacho",
        variant: "destructive",
      });
    }
  };

  // Eliminar despacho
  const handleEliminarDespacho = async (id: number) => {
    try {
      await despachosAPI.eliminarDespacho(id);
      toast({
        title: "Éxito",
        description: "Despacho eliminado exitosamente",
      });
      loadDespachos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el despacho",
        variant: "destructive",
      });
    }
  };

  // Obtener badge de estado
  const getEstadoBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
      icon: React.ElementType;
      color: string;
    }> = {
      "PENDIENTE": {
        label: "Pendiente",
        variant: "secondary",
        icon: Clock,
        color: "text-yellow-600",
      },
      "EN_PREPARACION": {
        label: "En Preparación",
        variant: "default",
        icon: Package,
        color: "text-blue-600",
      },
      "LISTO_PARA_ENVIO": {
        label: "Listo para Envío",
        variant: "outline",
        icon: Truck,
        color: "text-green-600",
      },
      "FALLIDO": {
        label: "Fallido",
        variant: "destructive",
        icon: XCircle,
        color: "text-red-600",
      },
    };

    const config = statusConfig[estado] || statusConfig["PENDIENTE"];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Despachos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Administra y controla el estado de los despachos
          </p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Despacho
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Despacho</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="idPedido">ID del Pedido</Label>
                <Input
                  id="idPedido"
                  type="number"
                  value={newDespacho.idPedido}
                  onChange={(e) => setNewDespacho(prev => ({ ...prev, idPedido: e.target.value }))}
                  placeholder="Ingrese el ID del pedido"
                />
              </div>
              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={newDespacho.observaciones}
                  onChange={(e) => setNewDespacho(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Observaciones del despacho"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateDespacho}>
                  Crear Despacho
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">{stats.pendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">En Preparación</p>
                <p className="text-2xl font-bold">{stats.enPreparacion}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Listos para Envío</p>
                <p className="text-2xl font-bold">{stats.listosParaEnvio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Fallidos</p>
                <p className="text-2xl font-bold">{stats.fallidos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Despachos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Despachos</CardTitle>
          <CardDescription>
            Gestiona el estado y seguimiento de todos los despachos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead>Actualizado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {despachos.map((despacho) => (
                    <TableRow key={despacho.id}>
                      <TableCell className="font-medium">{despacho.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">#{despacho.idPedido}</Badge>
                      </TableCell>
                      <TableCell>{getEstadoBadge(despacho.estado)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {despacho.observaciones || "Sin observaciones"}
                      </TableCell>
                      <TableCell>{formatDate(despacho.creado_en)}</TableCell>
                      <TableCell>{formatDate(despacho.actualizado_en)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={showDetailsModal && selectedDespacho?.id === despacho.id} onOpenChange={(open) => {
                            if (open) {
                              setSelectedDespacho(despacho);
                              setShowDetailsModal(true);
                            } else {
                              setShowDetailsModal(false);
                              setSelectedDespacho(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalles del Despacho #{despacho.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>ID del Pedido</Label>
                                    <p className="text-sm text-gray-600">#{despacho.idPedido}</p>
                                  </div>
                                  <div>
                                    <Label>Estado</Label>
                                    <div className="mt-1">{getEstadoBadge(despacho.estado)}</div>
                                  </div>
                                </div>
                                <div>
                                  <Label>Observaciones</Label>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {despacho.observaciones || "Sin observaciones"}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Creado</Label>
                                    <p className="text-sm text-gray-600">{formatDate(despacho.creado_en)}</p>
                                  </div>
                                  <div>
                                    <Label>Actualizado</Label>
                                    <p className="text-sm text-gray-600">{formatDate(despacho.actualizado_en)}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {despacho.estado !== "FALLIDO" && (
                            <Button
                              size="sm"
                              onClick={() => handleAvanzarEstado(despacho.id)}
                              disabled={despacho.estado === "LISTO_PARA_ENVIO"}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}

                          {despacho.estado !== "FALLIDO" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleMarcarFallido(despacho.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}

                          {despacho.estado === "FALLIDO" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReiniciarDespacho(despacho.id)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEliminarDespacho(despacho.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 