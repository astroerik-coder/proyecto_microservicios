"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  XCircle,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Truck,
} from "lucide-react";
import { despachosAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DespachoActionsProps {
  despacho: {
    id: number;
    idPedido: number;
    estado: string;
    observaciones: string;
  };
  onActionCompleted: () => void;
}

export default function DespachoActions({ despacho, onActionCompleted }: DespachoActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleAvanzarEstado = async () => {
    setLoading("avanzar");
    try {
      await despachosAPI.avanzarEstado(despacho.id);
      toast({
        title: "✅ Estado Actualizado",
        description: `Despacho #${despacho.id} avanzado exitosamente`,
      });
      onActionCompleted();
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar el estado del despacho",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
      setShowConfirmDialog(null);
    }
  };

  const handleMarcarFallido = async () => {
    setLoading("fallido");
    try {
      await despachosAPI.marcarFallido(despacho.id);
      toast({
        title: "❌ Despacho Fallido",
        description: `Despacho #${despacho.id} marcado como fallido`,
      });
      onActionCompleted();
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo marcar el despacho como fallido",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
      setShowConfirmDialog(null);
    }
  };

  const handleReiniciarDespacho = async () => {
    setLoading("reiniciar");
    try {
      await despachosAPI.reiniciarDespacho(despacho.id);
      toast({
        title: "🔄 Despacho Reiniciado",
        description: `Despacho #${despacho.id} reiniciado a estado PENDIENTE`,
      });
      onActionCompleted();
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo reiniciar el despacho",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
      setShowConfirmDialog(null);
    }
  };

  const getNextEstado = (estadoActual: string) => {
    const estados = ["PENDIENTE", "EN_PREPARACION", "LISTO_PARA_ENVIO"];
    const currentIndex = estados.indexOf(estadoActual);
    return currentIndex < estados.length - 1 ? estados[currentIndex + 1] : null;
  };

  const config = getEstadoConfig(despacho.estado);
  const nextEstado = getNextEstado(despacho.estado);

  return (
    <div className="flex items-center gap-2">
      {/* Avanzar Estado */}
      {despacho.estado !== "FALLIDO" && despacho.estado !== "LISTO_PARA_ENVIO" && (
        <Dialog open={showConfirmDialog === "avanzar"} onOpenChange={(open) => setShowConfirmDialog(open ? "avanzar" : null)}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              onClick={() => setShowConfirmDialog("avanzar")}
              disabled={loading !== null}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-600" />
                Confirmar Avance de Estado
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">¿Estás seguro?</span>
                </div>
                <p className="text-sm text-blue-700">
                  El despacho #<strong>{despacho.id}</strong> cambiará de estado:
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={config.color}>
                    {config.label}
                  </Badge>
                  <span className="text-blue-600">→</span>
                  <Badge variant="outline" className="text-green-600">
                    {nextEstado === "EN_PREPARACION" ? "En Preparación" : "Listo para Envío"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(null)}
                  disabled={loading !== null}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAvanzarEstado}
                  disabled={loading !== null}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading === "avanzar" ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Avanzando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirmar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Marcar como Fallido */}
      {despacho.estado !== "FALLIDO" && (
        <Dialog open={showConfirmDialog === "fallido"} onOpenChange={(open) => setShowConfirmDialog(open ? "fallido" : null)}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowConfirmDialog("fallido")}
              disabled={loading !== null}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Marcar como Fallido
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">¡Atención!</span>
                </div>
                <p className="text-sm text-red-700">
                  ¿Estás seguro de que quieres marcar el despacho #<strong>{despacho.id}</strong> como fallido?
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Esta acción cambiará el estado a "FALLIDO" y requerirá reiniciar el despacho para continuar.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(null)}
                  disabled={loading !== null}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleMarcarFallido}
                  disabled={loading !== null}
                >
                  {loading === "fallido" ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Marcando...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Marcar como Fallido
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reiniciar Despacho */}
      {despacho.estado === "FALLIDO" && (
        <Dialog open={showConfirmDialog === "reiniciar"} onOpenChange={(open) => setShowConfirmDialog(open ? "reiniciar" : null)}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConfirmDialog("reiniciar")}
              disabled={loading !== null}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                Reiniciar Despacho
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Confirmar Reinicio</span>
                </div>
                <p className="text-sm text-blue-700">
                  ¿Quieres reiniciar el despacho #<strong>{despacho.id}</strong>?
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  El despacho volverá al estado "PENDIENTE" y podrás procesarlo nuevamente.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(null)}
                  disabled={loading !== null}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReiniciarDespacho}
                  disabled={loading !== null}
                >
                  {loading === "reiniciar" ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Reiniciando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reiniciar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 