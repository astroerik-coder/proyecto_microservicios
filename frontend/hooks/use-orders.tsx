"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface OrderItem {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customerId: string
  customerName: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "ready_to_ship" | "shipped" | "completed" | "cancelled"
  createdAt: string
}

interface OrdersContextType {
  orders: Order[]
  createOrder: (order: Omit<Order, "id" | "createdAt">) => void
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerId: "2",
      customerName: "María González",
      items: [
        { id: "1", name: "Arroz Premium", sku: "ARR-001", price: 2500, quantity: 2 },
        { id: "2", name: "Aceite de Cocina", sku: "ACE-001", price: 4500, quantity: 1 },
      ],
      total: 9500,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ORD-002",
      customerId: "2",
      customerName: "Carlos Rodríguez",
      items: [{ id: "3", name: "Azúcar Blanca", sku: "AZU-001", price: 3200, quantity: 1 }],
      total: 3200,
      status: "processing",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "ORD-003",
      customerId: "2",
      customerName: "Ana Martínez",
      items: [{ id: "4", name: "Frijoles Negros", sku: "FRI-001", price: 2800, quantity: 3 }],
      total: 8400,
      status: "ready_to_ship",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ])

  const createOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [newOrder, ...prev])
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    // Simulación de llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: status as Order["status"] } : order)),
    )
  }

  return <OrdersContext.Provider value={{ orders, createOrder, updateOrderStatus }}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
