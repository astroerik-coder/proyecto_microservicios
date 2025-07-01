"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Cobro {
  id: number;
  idPedido: number;
  monto: number;
  metodoPago: string;
  estadoPago: "PENDIENTE" | "PAGADO" | "FALLIDO";
  referenciaPago: string;
  eliminado: boolean;
  creado_en: string;
  actualizado_en: string;
}

interface CobrosTableProps {
  onProcesarCobro: (cobroId: number) => Promise<void>;
  onMarcarFallido: (cobroId: number) => Promise<void>;
}

export default function CobrosTable({ onProcesarCobro, onMarcarFallido }: CobrosTableProps) {
  const [cobros, setCobros] = useState<Cobro[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCobro, setProcessingCobro] = useState<number | null>(null);

  useEffect(() => {
    loadCobros();
  }, []);

  const loadCobros = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/cobros", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Error al cargar cobros");
      }
      
      const data = await response.json();
      setCobros(data);
    } catch (error) {
      console.error("Error loading cobros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcesarCobro = async (cobroId: number) => {
    setProcessingCobro(cobroId);
    try {
      await onProcesarCobro(cobroId);
      await loadCobros(); // Recargar la lista
    } finally {
      setProcessingCobro(null);
    }
  };

  const handleMarcarFallido = async (cobroId: number) => {
    setProcessingCobro(cobroId);
    try {
      await onMarcarFallido(cobroId);
      await loadCobros(); // Recargar la lista
    } finally {
      setProcessingCobro(null);
    }
  };

  const getStatusBadge = (estado: string) => {
    const statusConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline" | "destructive";
      icon: React.ComponentType<{ className?: string }>;
    }> = {
      "PENDIENTE": { 
        label: "Pendiente", 
        variant: "secondary",
        icon: Clock
      },
      "PAGADO": { 
        label: "Pagado", 
        variant: "outline",
        icon: CheckCircle
      },
      "FALLIDO": { 
        label: "Fallido", 
        variant: "destructive",
        icon: XCircle
      },
    };

    const config = statusConfig[estado] || statusConfig["PENDIENTE"];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getMetodoPagoBadge = (metodo: string) => {
    const metodoConfig: Record<string, {
      label: string;
      variant: "secondary" | "default" | "outline";
    }> = {
      "EFECTIVO": { label: "Efectivo", variant: "default" },
      "TARJETA": { label: "Tarjeta", variant: "outline" },
      "TRANSFERENCIA": { label: "Transferencia", variant: "secondary" },
    };

    const config = metodoConfig[metodo] || metodoConfig["EFECTIVO"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
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

  // Calcular estadísticas
  const stats = {
    total: cobros.length,
    pendientes: cobros.filter(c => c.estadoPago === "PENDIENTE").length,
    pagados: cobros.filter(c => c.estadoPago === "PAGADO").length,
    fallidos: cobros.filter(c => c.estadoPago === "FALLIDO").length,
    totalMonto: cobros.reduce((sum, c) => sum + c.monto, 0),
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-2">Cargando cobros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cobros</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.pagados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.fallidos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monto</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalMonto.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Cobros */}
      <Card>
        <CardHeader>
          <CardTitle>Cobros</CardTitle>
        </CardHeader>
        <CardContent>
          {cobros.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay cobros para mostrar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cobros.map((cobro) => (
                  <TableRow key={cobro.id}>
                    <TableCell className="font-medium">#{cobro.id}</TableCell>
                    <TableCell>Pedido #{cobro.idPedido}</TableCell>
                    <TableCell className="font-semibold">${cobro.monto.toLocaleString()}</TableCell>
                    <TableCell>{getMetodoPagoBadge(cobro.metodoPago)}</TableCell>
                    <TableCell>{getStatusBadge(cobro.estadoPago)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {cobro.referenciaPago || "Sin referencia"}
                    </TableCell>
                    <TableCell>{formatDate(cobro.creado_en)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {cobro.estadoPago === "PENDIENTE" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleProcesarCobro(cobro.id)}
                              disabled={processingCobro === cobro.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {processingCobro === cobro.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Procesar
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleMarcarFallido(cobro.id)}
                              disabled={processingCobro === cobro.id}
                            >
                              {processingCobro === cobro.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Fallar
                                </>
                              )}
                            </Button>
                          </>
                        )}
                        {cobro.estadoPago === "PAGADO" && (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Procesado
                          </Badge>
                        )}
                        {cobro.estadoPago === "FALLIDO" && (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Fallido
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 