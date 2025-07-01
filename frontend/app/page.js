"use client"

import { useState } from "react"
import { ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Simulación de productos del microservicio de inventario
const productos = [
  {
    id: 1,
    nombre: "Aceite de Cocina Premium",
    precio: 4500,
    stock: 25,
    categoria: "Aceites",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Aceite de girasol premium para cocina",
  },
  {
    id: 2,
    nombre: "Arroz Blanco 1kg",
    precio: 2800,
    stock: 50,
    categoria: "Granos",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Arroz blanco de primera calidad",
  },
  {
    id: 3,
    nombre: "Leche Entera 1L",
    precio: 1200,
    stock: 30,
    categoria: "Lácteos",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Leche entera pasteurizada",
  },
  {
    id: 4,
    nombre: "Pan de Molde",
    precio: 1800,
    stock: 15,
    categoria: "Panadería",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Pan de molde integral",
  },
  {
    id: 5,
    nombre: "Detergente Líquido",
    precio: 3200,
    stock: 20,
    categoria: "Limpieza",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Detergente líquido concentrado",
  },
  {
    id: 6,
    nombre: "Café Molido 500g",
    precio: 5500,
    stock: 12,
    categoria: "Bebidas",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Café molido premium",
  },
]

export default function HomePage() {
  const [carrito, setCarrito] = useState([])
  const [filtroCategoria, setFiltroCategoria] = useState("Todos")

  const categorias = ["Todos", ...new Set(productos.map((p) => p.categoria))]

  const productosFiltrados =
    filtroCategoria === "Todos" ? productos : productos.filter((p) => p.categoria === filtroCategoria)

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id)
      if (existente) {
        return prev.map((item) => (item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item))
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const totalCarrito = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const cantidadCarrito = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DistribuMax</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600 font-medium">
                Productos
              </Link>
              <Link href="/pedidos" className="text-gray-600 hover:text-blue-600">
                Mis Pedidos
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">
                Admin
              </Link>
            </nav>

            <Link href="/carrito">
              <Button variant="outline" className="relative bg-transparent">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrito
                {cantidadCarrito > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    {cantidadCarrito}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Categorías</h2>
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <Button
                key={categoria}
                variant={filtroCategoria === categoria ? "default" : "outline"}
                onClick={() => setFiltroCategoria(categoria)}
                className="mb-2"
              >
                {categoria}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <Card key={producto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img
                  src={producto.imagen || "/placeholder.svg"}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{producto.nombre}</CardTitle>
                <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-green-600">${producto.precio.toLocaleString()}</span>
                  <Badge variant={producto.stock > 10 ? "default" : "destructive"}>Stock: {producto.stock}</Badge>
                </div>
                <Badge variant="secondary">{producto.categoria}</Badge>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button onClick={() => agregarAlCarrito(producto)} disabled={producto.stock === 0} className="w-full">
                  {producto.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Resumen del carrito flotante */}
        {carrito.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-semibold">{cantidadCarrito} productos</p>
                <p className="text-green-600 font-bold">${totalCarrito.toLocaleString()}</p>
              </div>
              <Link href="/carrito">
                <Button>Ver Carrito</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
