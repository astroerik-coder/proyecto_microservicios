"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  CreditCard,
  RefreshCw,
  Trash2,
  Eye,
  Package,
  Truck,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import { PedidoCompleto } from "@/types/product";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { useToast } from "@/hooks/use-toast";

interface PedidosTableProps {
  pedidos: PedidoCompleto[];
  onViewOrder: (pedido: PedidoCompleto) => void;
  onViewEnvio?: (pedido: PedidoCompleto) => void;
  onTrackPedido?: (pedido: PedidoCompleto) => void;
  onCreateDespacho: (pedido: PedidoCompleto) => void;
  onAvanzarDespacho: (despachoId: number) => Promise<void>;
  onCreateCobro: (pedido: PedidoCompleto) => void;
  onProcesarCobro: (cobroId: number) => Promise<void>;
  onDeletePedido: (pedidoId: number) => Promise<void>;
  onApprovePedido?: (pedidoId: number) => Promise<void>;
  isAdmin?: boolean;
}

export default function PedidosTable({
  pedidos,
  onViewOrder,
  onViewEnvio,
  onTrackPedido,
  onCreateDespacho,
  onAvanzarDespacho,
  onCreateCobro,
  onProcesarCobro,
  onDeletePedido,
  onApprovePedido,
  isAdmin = false,
}: PedidosTableProps) {
  const [updatingStates, setUpdatingStates] = useState<Set<string>>(new Set());
  const { registerUpdateCallback, updateSpecificPedido } = useRealtimeUpdates();
  const { toast } = useToast();

  // Validar que pedidos sea un array
  const validPedidos = Array.isArray(pedidos) ? pedidos : [];

  // Registrar callbacks de actualización para cada pedido
  useEffect(() => {
    const unregisters: (() => void)[] = [];
    
    validPedidos.forEach((pedido) => {
      const unregister = registerUpdateCallback(`pedido-${pedido.id}`, () => {
        // Actualizar solo este pedido específico
        updateSpecificPedido(pedido.id);
      });
      unregisters.push(unregister);
    });

    return () => {
      unregisters.forEach(unregister => unregister());
    };
  }, [validPedidos, registerUpdateCallback, updateSpecificPedido]);

  const getStatusBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
    }> = {
      "PENDIENTE_APROBACION": { label: "Pendiente de Aprobación", variant: "secondary" },
      "Recibido": { label: "Recibido", variant: "secondary" },
      "Procesando": { label: "Procesando", variant: "default" },
      "Listo para despachar": { label: "Listo para despachar", variant: "outline" },
      "Listo para pagar": { label: "Listo para pagar", variant: "outline" },
      "Enviado": { label: "Enviado", variant: "default" },
      "Cancelado": { label: "Cancelado", variant: "destructive" },
    };

    const config = statusConfig[estado] || statusConfig["Recibido"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDespachoStatusBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
    }> = {
      "PENDIENTE": { label: "Pendiente", variant: "secondary" },
      "EN_PREPARACION": { label: "En Preparación", variant: "default" },
      "LISTO_PARA_ENVIO": { label: "Listo para Envío", variant: "outline" },
      "FALLIDO": { label: "Fallido", variant: "destructive" },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAvanzarDespacho = useCallback(async (despachoId: number, pedidoId: number) => {
    const actionKey = `avanzar-despacho-${despachoId}`;
    setUpdatingStates(prev => new Set(prev).add(actionKey));
    
    try {
      await onAvanzarDespacho(despachoId);
      toast({
        title: "✅ Estado Actualizado",
        description: "El estado del despacho ha sido actualizado",
      });
      // Actualizar solo este pedido específico
      await updateSpecificPedido(pedidoId);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar el estado del despacho",
        variant: "destructive",
      });
    } finally {
      setUpdatingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  }, [onAvanzarDespacho, updateSpecificPedido, toast]);

  const handleProcesarCobro = useCallback(async (cobroId: number, pedidoId: number) => {
    const actionKey = `procesar-cobro-${cobroId}`;
    setUpdatingStates(prev => new Set(prev).add(actionKey));
    
    try {
      await onProcesarCobro(cobroId);
      toast({
        title: "✅ Cobro Procesado",
        description: "El cobro ha sido procesado exitosamente",
      });
      // Actualizar solo este pedido específico
      await updateSpecificPedido(pedidoId);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo procesar el cobro",
        variant: "destructive",
      });
    } finally {
      setUpdatingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  }, [onProcesarCobro, updateSpecificPedido, toast]);

  const handleDeletePedido = useCallback(async (pedidoId: number) => {
    const actionKey = `delete-pedido-${pedidoId}`;
    setUpdatingStates(prev => new Set(prev).add(actionKey));
    
    try {
      await onDeletePedido(pedidoId);
      toast({
        title: "✅ Pedido Eliminado",
        description: "El pedido ha sido eliminado exitosamente",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo eliminar el pedido",
        variant: "destructive",
      });
    } finally {
      setUpdatingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  }, [onDeletePedido, toast]);

  const handleApprovePedido = useCallback(async (pedidoId: number) => {
    const actionKey = `approve-${pedidoId}`;
    setUpdatingStates(prev => new Set(prev).add(actionKey));
    
    try {
      await onApprovePedido!(pedidoId);
      toast({
        title: "✅ Pedido Aprobado",
        description: "El pedido ha sido aprobado exitosamente",
      });
      // Actualizar solo este pedido específico
      await updateSpecificPedido(pedidoId);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo aprobar el pedido",
        variant: "destructive",
      });
    } finally {
      setUpdatingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  }, [onApprovePedido, updateSpecificPedido, toast]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado Pedido</TableHead>
            {isAdmin && <TableHead>Estado Despacho</TableHead>}
            {isAdmin && <TableHead>Estado Cobro</TableHead>}
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validPedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">#{pedido.id}</TableCell>
              <TableCell>Cliente #{pedido.idCliente}</TableCell>
              <TableCell>{formatDate(pedido.fechaPedido)}</TableCell>
              <TableCell>${pedido.total.toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(pedido.estado)}</TableCell>
              
              {isAdmin && (
                <TableCell>
                  {pedido.despacho ? (
                    getDespachoStatusBadge(pedido.despacho.estado)
                  ) : (
                    <Badge variant="secondary">Sin despacho</Badge>
                  )}
                </TableCell>
              )}
              
              {isAdmin && (
                <TableCell>
                  {pedido.cobro ? (
                    getCobroStatusBadge(pedido.cobro.estado)
                  ) : (
                    <Badge variant="secondary">Sin cobro</Badge>
                  )}
                </TableCell>
              )}
              
              <TableCell>
                <div className="flex gap-2">
                  {/* Ver Detalles */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewOrder(pedido)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  {/* Ver Envío (solo si existe) */}
                  {pedido.envio  && typeof onViewEnvio === 'function' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewEnvio(pedido)}
                      title="Ver Envío"
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <ShoppingCart className="w-3 h-3" />
                    </Button>
                  )}
                  {/* Trackeo de Pedido (solo si no está pendiente de aprobación) */}
                  {typeof onTrackPedido === 'function' && pedido.estado !== 'PENDIENTE_APROBACION' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTrackPedido(pedido)}
                      title="Seguimiento del Pedido"
                      className="flex items-center gap-1"
                    >
                      <Truck className="w-3 h-3" />
                    </Button>
                  )}
                  {/* Aprobar Pedido (solo admin) */}
                  {isAdmin && pedido.estado === "PENDIENTE_APROBACION" && onApprovePedido && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprovePedido(pedido.id)}
                      disabled={updatingStates.has(`approve-${pedido.id}`)}
                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      {updatingStates.has(`approve-${pedido.id}`) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                      ) : (
                        <CheckCircle className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                  
                  {/* Acciones específicas para admin */}
                  {isAdmin && (
                    <>
                      {/* Crear Despacho */}
                      {pedido.estado === "Listo para despachar" && !pedido.despacho && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCreateDespacho(pedido)}
                        >
                          <Package className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {/* Avanzar Despacho */}
                      {pedido.despacho && pedido.despacho.estado !== "LISTO_PARA_ENVIO" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAvanzarDespacho(pedido.despacho!.id, pedido.id)}
                          disabled={updatingStates.has(`avanzar-despacho-${pedido.despacho!.id}`)}
                        >
                          {updatingStates.has(`avanzar-despacho-${pedido.despacho!.id}`) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                      
                      {/* Crear Cobro */}
                      {pedido.estado === "Listo para pagar" && !pedido.cobro && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCreateCobro(pedido)}
                        >
                          <CreditCard className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {/* Procesar Cobro */}
                      {pedido.cobro && pedido.cobro.estado === "PENDIENTE" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProcesarCobro(pedido.cobro!.id, pedido.id)}
                          disabled={updatingStates.has(`procesar-cobro-${pedido.cobro!.id}`)}
                        >
                          {updatingStates.has(`procesar-cobro-${pedido.cobro!.id}`) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          ) : (
                            <RefreshCw className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                      
                      {/* Eliminar Pedido */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePedido(pedido.id)}
                        disabled={updatingStates.has(`delete-pedido-${pedido.id}`)}
                        className="text-red-600 hover:text-red-700"
                      >
                        {updatingStates.has(`delete-pedido-${pedido.id}`) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </>
                  )}
                  {/* Botón de pago para el cliente */}
                  {!isAdmin && pedido.estado === "Listo para pagar" && !pedido.cobro && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCreateCobro(pedido)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <CreditCard className="w-3 h-3 mr-1" />
                      Pagar
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 