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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EnvioTracking from "@/components/envio-tracking";
import { Truck, CheckCircle, XCircle, Undo2, Trash2 } from "lucide-react";
import CrearEnvioModal from "@/components/envios/crear-envio-modal";

interface Envio {
  id: number;
  idDespacho: number;
  transportista: string;
  guiaSeguimiento: string;
  estado: "EN_TRANSITO" | "ENTREGADO" | "DEVUELTO" | "CANCELADO";
  creado_en: string;
  actualizado_en: string;
}

export default function EnviosTable() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnvio, setSelectedEnvio] = useState<Envio | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showCrearEnvio, setShowCrearEnvio] = useState(false);
  const [despachosListos, setDespachosListos] = useState<any[]>([]);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState<
    number | null
  >(null);
  const [despachoDetalle, setDespachoDetalle] = useState<any | null>(null);
  const [pedidoDetalle, setPedidoDetalle] = useState<any | null>(null);

  useEffect(() => {
    loadEnvios();
  }, []);

  const loadEnvios = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8088/api/envios");
      const data = await response.json();
      setEnvios(data);
    } catch (error) {
      console.error("Error cargando envíos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDespachosListos = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/despachos");
      if (!response.ok) throw new Error("No se pudo cargar despachos");
      const data = await response.json();
      // Filtra solo los que están listos para envío
      const listos = Array.isArray(data)
        ? data.filter((d) => d.estado === "LISTO_PARA_ENVIO")
        : [];
      setDespachosListos(listos);
    } catch (error) {
      setDespachosListos([]); // Siempre un array
      console.error("Error cargando despachos listos:", error);
    }
  };

  const handleOpenCrearEnvio = async () => {
    await loadDespachosListos();
    setShowCrearEnvio(true);
  };

  const handleAvanzar = async (id: number) => {
    setProcessing(true);
    await fetch(`http://localhost:8088/api/envios/${id}/avanzar`, {
      method: "POST",
    });
    await loadEnvios();
    setProcessing(false);
  };
  const handleDevolver = async (id: number) => {
    setProcessing(true);
    await fetch(`http://localhost:8088/api/envios/${id}/devolver`, {
      method: "POST",
    });
    await loadEnvios();
    setProcessing(false);
  };
  const handleCancelar = async (id: number) => {
    setProcessing(true);
    await fetch(`http://localhost:8088/api/envios/${id}/cancelar`, {
      method: "POST",
    });
    await loadEnvios();
    setProcessing(false);
  };
  const handleEliminar = async (id: number) => {
    setProcessing(true);
    await fetch(`http://localhost:8088/api/envios/${id}`, { method: "DELETE" });
    await loadEnvios();
    setProcessing(false);
  };

  const getStatusBadge = (estado: string) => {
    const config: Record<
      string,
      {
        label: string;
        color: "outline" | "default" | "secondary" | "destructive";
        icon: any;
      }
    > = {
      EN_TRANSITO: { label: "En Tránsito", color: "outline", icon: Truck },
      ENTREGADO: { label: "Entregado", color: "default", icon: CheckCircle },
      DEVUELTO: { label: "Devuelto", color: "secondary", icon: Undo2 },
      CANCELADO: { label: "Cancelado", color: "destructive", icon: XCircle },
    };
    const c = config[estado] || config["EN_TRANSITO"];
    const Icon = c.icon;
    return (
      <Badge variant={c.color} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {c.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchDespachoYPedido = async () => {
      if (selectedEnvio) {
        try {
          // 1. Obtener el despacho
          const resDespacho = await fetch(
            `http://localhost:8087/api/despachos/${selectedEnvio.idDespacho}`
          );
          if (!resDespacho.ok) throw new Error("No se pudo cargar el despacho");
          const despacho = await resDespacho.json();
          setDespachoDetalle(despacho);

          // 2. Obtener el pedido
          if (despacho && despacho.idPedido) {
            const resPedido = await fetch(
              `http://localhost:8088/api/pedidos/${despacho.idPedido}`
            );
            if (!resPedido.ok) throw new Error("No se pudo cargar el pedido");
            const pedido = await resPedido.json();
            setPedidoDetalle(pedido);
          } else {
            setPedidoDetalle(null);
          }
        } catch (error) {
          setDespachoDetalle(null);
          setPedidoDetalle(null);
          console.error("Error cargando despacho o pedido:", error);
        }
      } else {
        setDespachoDetalle(null);
        setPedidoDetalle(null);
      }
    };
    fetchDespachoYPedido();
  }, [selectedEnvio]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Envíos</h2>
        <Button
          onClick={handleOpenCrearEnvio}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Agregar Envío
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Despacho</TableHead>
            <TableHead>Transportista</TableHead>
            <TableHead>Guía</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {envios.map((envio) => (
            <TableRow key={envio.id}>
              <TableCell>#{envio.id}</TableCell>
              <TableCell>#{envio.idDespacho}</TableCell>
              <TableCell>{envio.transportista}</TableCell>
              <TableCell className="font-mono text-xs">
                {envio.guiaSeguimiento}
              </TableCell>
              <TableCell>{getStatusBadge(envio.estado)}</TableCell>
              <TableCell>{formatDate(envio.creado_en)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedEnvio(envio)}
                  >
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleEliminar(envio.id)}
                    disabled={processing}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de detalle y acciones */}
      {selectedEnvio && (
        <Dialog open={true} onOpenChange={() => setSelectedEnvio(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Envío #{selectedEnvio.id}
              </DialogTitle>
            </DialogHeader>
            <EnvioTracking
              estado={selectedEnvio.estado}
              transportista={selectedEnvio.transportista}
              guiaSeguimiento={selectedEnvio.guiaSeguimiento}
              fechaEnvio={selectedEnvio.creado_en}
              fechaActualizacion={selectedEnvio.actualizado_en}
            />
            {/* Seguimiento del Pedido */}
            {pedidoDetalle && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Seguimiento del Pedido #{pedidoDetalle.id}
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <strong>Estado:</strong> {pedidoDetalle.estado}
                  </li>
                  <li>
                    <strong>Fecha de pedido:</strong>{" "}
                    {formatDate(pedidoDetalle.creado_en)}
                  </li>
                </ul>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              {selectedEnvio.estado === "EN_TRANSITO" && (
                <>
                  <Button
                    onClick={() => handleAvanzar(selectedEnvio.id)}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    Marcar como Entregado
                  </Button>
                  <Button
                    onClick={() => handleDevolver(selectedEnvio.id)}
                    disabled={processing}
                    className="bg-yellow-600 hover:bg-yellow-700 flex-1"
                  >
                    Devolver
                  </Button>
                  <Button
                    onClick={() => handleCancelar(selectedEnvio.id)}
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 flex-1"
                  >
                    Cancelar
                  </Button>
                </>
              )}
              {(selectedEnvio.estado === "ENTREGADO" ||
                selectedEnvio.estado === "DEVUELTO" ||
                selectedEnvio.estado === "CANCELADO") && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedEnvio(null)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para crear envío seleccionando despacho */}
      {showCrearEnvio && (
        <Dialog
          open={showCrearEnvio}
          onOpenChange={() => setShowCrearEnvio(false)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Envío</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Despacho
                </label>
                <select
                  className="w-full border rounded p-2"
                  value={despachoSeleccionado ?? ""}
                  onChange={(e) =>
                    setDespachoSeleccionado(Number(e.target.value))
                  }
                >
                  <option value="">Selecciona un despacho...</option>
                  {despachosListos.map((d) => (
                    <option key={d.id} value={d.id}>
                      #{d.id} - Pedido #{d.idPedido}
                    </option>
                  ))}
                </select>
              </div>
              {despachoSeleccionado && (
                <CrearEnvioModal
                  idDespacho={despachoSeleccionado}
                  open={true}
                  onClose={() => {
                    setShowCrearEnvio(false);
                    setDespachoSeleccionado(null);
                  }}
                  onSuccess={async () => {
                    setShowCrearEnvio(false);
                    setDespachoSeleccionado(null);
                    await loadEnvios();
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
