"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface CrearEnvioModalProps {
  idDespacho: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TRANSPORTISTAS = ["DHL", "FedEx", "UPS"];

export default function CrearEnvioModal({ idDespacho, open, onClose, onSuccess }: CrearEnvioModalProps) {
  const [transportista, setTransportista] = useState(TRANSPORTISTAS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generar guía automática
  const guiaSeguimiento = `${transportista}-${Date.now()}`;

  const handleCrear = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8088/api/envios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idDespacho,
          transportista,
          guiaSeguimiento,
        }),
      });
      if (!response.ok) throw new Error("Error al crear el envío");
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Envío</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Transportista</label>
            <Select value={transportista} onValueChange={setTransportista}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSPORTISTAS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Guía de Seguimiento</label>
            <Input value={guiaSeguimiento} readOnly />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleCrear} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Creando..." : "Crear Envío"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 