"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CarritoPage() {
  const [carrito, setCarrito] = useState([])
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    observaciones: "",
  })
  const router = useRouter()

  useEffect(() => {
    // Simular carga del carrito desde localStorage o estado global
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito") || "[]")
    setCarrito(carritoGuardado)
  }, [])

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(id)
      return
    }

    setCarrito((prev) => prev.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item)))
  }

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const realizarPedido = async () => {
    if (!datosCliente.nombre || !datosCliente.telefono || !datosCliente.direccion) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    const pedido = {
      id: Date.now(),
      cliente: datosCliente,
      productos: carrito,
      total: total,
      fecha: new Date().toISOString(),
      estado: "PENDIENTE",
    }

    try {
      // Simular llamada al microservicio de pedidos
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      })

      if (response.ok) {
        localStorage.removeItem("carrito")
        alert("¡Pedido realizado con éxito!")
        router.push("/pedidos")
      }
    } catch (error) {
      console.error("Error al realizar pedido:", error)
      alert("Error al procesar el pedido")
    }
  }

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Carrito Vacío</h2>
            <p className="text-gray-600 mb-6">No tienes productos en tu carrito</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Productos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4">Mi Carrito</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos ({carrito.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {carrito.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.imagen || "/placeholder.svg"}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.nombre}</h3>
                      <p className="text-gray-600">${item.precio.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.cantidad}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.precio * item.cantidad).toLocaleString()}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarProducto(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Formulario y resumen */}
          <div className="space-y-6">
            {/* Datos del cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Datos de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    value={datosCliente.nombre}
                    onChange={(e) => setDatosCliente((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={datosCliente.telefono}
                    onChange={(e) => setDatosCliente((prev) => ({ ...prev, telefono: e.target.value }))}
                    placeholder="Tu número de teléfono"
                  />
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Textarea
                    id="direccion"
                    value={datosCliente.direccion}
                    onChange={(e) => setDatosCliente((prev) => ({ ...prev, direccion: e.target.value }))}
                    placeholder="Dirección completa de entrega"
                  />
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={datosCliente.observaciones}
                    onChange={(e) => setDatosCliente((prev) => ({ ...prev, observaciones: e.target.value }))}
                    placeholder="Instrucciones especiales (opcional)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resumen del pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <Button onClick={realizarPedido} className="w-full" size="lg">
                  Realizar Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
