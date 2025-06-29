"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Package,
  Truck,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  Eye,
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

const estadosOrden = ["PENDIENTE", "EN_PREPARACION", "LISTO_PARA_ENVIO", "FALLIDO"];

export default function DespachoTracking() {
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDespacho, setSelectedDespacho] = useState<Despacho | null>(null);
  const { toast } = useToast();
  const { registerUpdateCallback } = useRealtimeUpdates();

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
    // Actualizar cada 30 segundos
    const interval = setInterval(loadDespachos, 30000);
    const unregister = registerUpdateCallback('despachos', loadDespachos);
    return () => {
      clearInterval(interval);
      unregister();
    };
  }, []);

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

  const getEstadoConfig = (estado: string) => {
    const configs = {
      "PENDIENTE": {
        label: "Pendiente",
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      },
      "EN_PREPARACION": {
        label: "En Preparación",
        icon: Package,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      "LISTO_PARA_ENVIO": {
        label: "Listo para Envío",
        icon: Truck,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      "FALLIDO": {
        label: "Fallido",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
    };
    return configs[estado as keyof typeof configs] || configs["PENDIENTE"];
  };

  const getProgressPercentage = (estado: string) => {
    const index = estadosOrden.indexOf(estado);
    if (estado === "FALLIDO") return 0;
    return ((index + 1) / estadosOrden.length) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDespachosByEstado = (estado: string) => {
    return despachos.filter(d => d.estado === estado);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Seguimiento de Despachos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitorea el estado de todos los despachos en tiempo real
        </p>
      </div>

      {/* Estados Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estadosOrden.map((estado) => {
          const config = getEstadoConfig(estado);
          const Icon = config.icon;
          const despachosEnEstado = getDespachosByEstado(estado);

          return (
            <Card key={estado} className={`${config.bgColor} ${config.borderColor} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-6 w-6 ${config.color}`} />
                    <CardTitle className={`text-lg ${config.color}`}>
                      {config.label}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {despachosEnEstado.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {despachosEnEstado.slice(0, 3).map((despacho) => (
                  <div
                    key={despacho.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        Despacho #{despacho.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        Pedido #{despacho.idPedido}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {despacho.observaciones || "Sin observaciones"}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(despacho.actualizado_en)}
                      </span>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Despacho #{despacho.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">ID del Pedido</label>
                                  <p className="text-sm text-gray-600">#{despacho.idPedido}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Estado</label>
                                  <div className="mt-1">
                                    <Badge variant="outline" className={config.color}>
                                      {config.label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Observaciones</label>
                                <p className="text-sm text-gray-600 mt-1">
                                  {despacho.observaciones || "Sin observaciones"}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Creado</label>
                                  <p className="text-sm text-gray-600">{formatDate(despacho.creado_en)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Actualizado</label>
                                  <p className="text-sm text-gray-600">{formatDate(despacho.actualizado_en)}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {estado !== "FALLIDO" && (
                          <Button
                            size="sm"
                            onClick={() => handleAvanzarEstado(despacho.id)}
                            disabled={estado === "LISTO_PARA_ENVIO"}
                            className="h-6 w-6 p-0"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        )}

                        {estado !== "FALLIDO" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleMarcarFallido(despacho.id)}
                            className="h-6 w-6 p-0"
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        )}

                        {estado === "FALLIDO" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReiniciarDespacho(despacho.id)}
                            className="h-6 w-6 p-0"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {despachosEnEstado.length > 3 && (
                  <div className="text-center text-sm text-gray-500">
                    +{despachosEnEstado.length - 3} más
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline de Progreso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Progreso General de Despachos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {despachos.slice(0, 5).map((despacho) => {
              const config = getEstadoConfig(despacho.estado);
              const progress = getProgressPercentage(despacho.estado);
              
              return (
                <div key={despacho.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Despacho #{despacho.id}</span>
                      <Badge variant="outline">Pedido #{despacho.idPedido}</Badge>
                    </div>
                    <Badge variant="outline" className={config.color}>
                      {config.label}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        despacho.estado === "FALLIDO" 
                          ? "bg-red-500" 
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Pendiente</span>
                    <span>En Preparación</span>
                    <span>Listo para Envío</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 