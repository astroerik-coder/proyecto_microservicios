"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
} from "lucide-react";
import { despachosAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CrearDespachoFormProps {
  onDespachoCreated?: () => void;
  pedidoId?: number;
}

export default function CrearDespachoForm({ 
  onDespachoCreated, 
  pedidoId 
}: CrearDespachoFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idPedido: pedidoId?.toString() || "",
    observaciones: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.idPedido.trim()) {
      newErrors.idPedido = "El ID del pedido es requerido";
    } else if (isNaN(Number(formData.idPedido)) || Number(formData.idPedido) <= 0) {
      newErrors.idPedido = "El ID del pedido debe ser un número válido";
    }

    if (formData.observaciones.length > 500) {
      newErrors.observaciones = "Las observaciones no pueden exceder 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await despachosAPI.crearDespacho({
        idPedido: parseInt(formData.idPedido),
        observaciones: formData.observaciones.trim(),
      });

      toast({
        title: "✅ Despacho Creado",
        description: `Despacho creado exitosamente para el pedido #${formData.idPedido}`,
      });

      // Reset form
      setFormData({
        idPedido: "",
        observaciones: "",
      });
      setErrors({});
      setShowModal(false);

      // Callback para actualizar la lista
      if (onDespachoCreated) {
        onDespachoCreated();
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo crear el despacho",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const observacionesCount = formData.observaciones.length;
  const maxObservaciones = 500;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear Despacho
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Crear Nuevo Despacho
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID del Pedido */}
          <div className="space-y-2">
            <Label htmlFor="idPedido" className="flex items-center gap-2">
              ID del Pedido
              <Badge variant="outline" className="text-xs">
                Requerido
              </Badge>
            </Label>
            <Input
              id="idPedido"
              type="number"
              value={formData.idPedido}
              onChange={(e) => handleInputChange("idPedido", e.target.value)}
              placeholder="Ej: 18"
              className={errors.idPedido ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.idPedido && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.idPedido}
              </p>
            )}
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones" className="flex items-center gap-2">
              Observaciones
              <Badge variant="secondary" className="text-xs">
                Opcional
              </Badge>
            </Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange("observaciones", e.target.value)}
              placeholder="Ej: Entregar rápido, cliente urgente..."
              rows={3}
              className={errors.observaciones ? "border-red-500" : ""}
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              {errors.observaciones && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.observaciones}
                </p>
              )}
              <p className={`text-xs ${
                observacionesCount > maxObservaciones * 0.8 
                  ? "text-orange-500" 
                  : "text-gray-500"
              }`}>
                {observacionesCount}/{maxObservaciones}
              </p>
            </div>
          </div>

          {/* Información del Estado */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Estado inicial:</span>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  PENDIENTE
                </Badge>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                El despacho se creará en estado pendiente y podrás avanzarlo manualmente.
              </p>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Crear Despacho
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 