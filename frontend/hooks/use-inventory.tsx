"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
}

interface InventoryContextType {
  inventory: InventoryItem[]
  updateStock: (itemId: string, newStock: number) => void
  decreaseStock: (itemId: string, quantity: number) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Arroz Premium",
      sku: "ARR-001",
      price: 2500,
      stock: 150,
      category: "Granos",
    },
    {
      id: "2",
      name: "Aceite de Cocina",
      sku: "ACE-001",
      price: 4500,
      stock: 80,
      category: "Aceites",
    },
    {
      id: "3",
      name: "Azúcar Blanca",
      sku: "AZU-001",
      price: 3200,
      stock: 200,
      category: "Endulzantes",
    },
    {
      id: "4",
      name: "Frijoles Negros",
      sku: "FRI-001",
      price: 2800,
      stock: 120,
      category: "Granos",
    },
    {
      id: "5",
      name: "Pasta Espagueti",
      sku: "PAS-001",
      price: 1800,
      stock: 90,
      category: "Pastas",
    },
    {
      id: "6",
      name: "Sal de Mesa",
      sku: "SAL-001",
      price: 800,
      stock: 300,
      category: "Condimentos",
    },
    {
      id: "7",
      name: "Leche en Polvo",
      sku: "LEC-001",
      price: 5500,
      stock: 45,
      category: "Lácteos",
    },
    {
      id: "8",
      name: "Café Molido",
      sku: "CAF-001",
      price: 6200,
      stock: 8,
      category: "Bebidas",
    },
  ])

  const updateStock = (itemId: string, newStock: number) => {
    setInventory((prev) => prev.map((item) => (item.id === itemId ? { ...item, stock: newStock } : item)))
  }

  const decreaseStock = (itemId: string, quantity: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, stock: Math.max(0, item.stock - quantity) } : item)),
    )
  }

  return (
    <InventoryContext.Provider value={{ inventory, updateStock, decreaseStock }}>{children}</InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
