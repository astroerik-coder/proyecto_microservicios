"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  stock: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  getCartTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.quantity < item.stock ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === productId)

      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
      } else {
        return prev.filter((item) => item.id !== productId)
      }
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
