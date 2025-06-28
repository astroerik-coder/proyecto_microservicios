// hooks/use-inventory.ts
"use client";
import { useEffect, useState } from "react";
import { inventarioAPI } from "@/lib/api";
import { useInventarioSocket } from "./use-inventario-socket";
import { Product } from "@/types/product";

export function useInventory() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const PAGE_SIZE = 25; // ajustable si deseas

  const fetchInventory = async () => {
    try {
      const res = await inventarioAPI.getInventory(0, PAGE_SIZE);
      const activos = res.content.filter((p: Product) => !p.eliminado);
      setInventory(activos);
    } catch (err) {
      console.error("Error al cargar inventario:", err);
    }
  };

  useEffect(() => {
    fetchInventory(); // carga inicial
  }, []);

  useInventarioSocket(() => {
    fetchInventory(); // actualiza cuando llega evento WS
  });

  return { inventory };
}
