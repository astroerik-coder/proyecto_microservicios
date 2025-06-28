"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { inventarioAPI } from "@/lib/api";
import { toast } from "sonner";
import { Product } from "@/types/product";

type ProductoFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  producto?: Product | null;
};

export default function ModalAgregarProducto({
  open,
  onOpenChange,
  onSuccess,
  producto,
}: ProductoFormProps) {
  const [form, setForm] = useState<Omit<Product, "id">>({
    nombre: "",
    descripcion: "",
    stock: 0,
    precio: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        stock: producto.stock,
        precio: producto.precio,
      });
    } else {
      setForm({ nombre: "", descripcion: "", stock: 0, precio: 0 });
    }
  }, [producto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "precio" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.precio < 0 || form.stock < 0) {
      toast.error("Los valores no pueden ser negativos");
      return;
    }

    setLoading(true);

    try {
      if (producto?.id) {
        await inventarioAPI.updateInventoryByID(producto.id.toString(), form);
        toast.success("Producto actualizado correctamente");
      } else {
        await inventarioAPI.insertInventory(form);
        toast.success("Producto creado correctamente");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {producto ? "Editar producto" : "Agregar producto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Precio</Label>
            <Input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : producto ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
