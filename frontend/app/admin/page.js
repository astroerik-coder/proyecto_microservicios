"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CreditCard, RefreshCw, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"

// Estados disponibles para cada microservicio
const estadosDespacho = ["PENDIENTE", "PREPARANDO", "DESPACHADO", "COMPLETADO"]
const estadosCobro = ["PENDIENTE", "PROCESANDO", "PAGADO", "RECHAZADO"]
const estadosEnvio = ["PENDIENTE", "EN_TRANSITO", "ENTREGADO", "DEVUELTO"]

// Datos simulados de pedidos para administración
const pedidosAdmin = [
  {
    id: 1001,
    fecha: "2024-01-15T10:30:00Z",
    cliente: "Juan Pérez",
    total: 11800,
    estadoDespacho: "COMPLETADO",
    estadoCobro: "PAGADO",
    estadoEnvio: "ENTREGADO",
  },
  {
    id: 1002,
    fecha: "2024-01-16T14:20:00Z",
    cliente: "María González",
    total: 6800,
    estadoDespacho: "DESPACHADO",
    estadoCobro: "PAGADO",
    estadoEnvio: "EN_TRANSITO",
  },
  {
    id: 1003,
    fecha: "2024-01-17T09:15:00Z",
    cliente: "Carlos Rodríguez",
    total: 9100,
    estadoDespacho: "PREPARANDO",
    estadoCobro: "PENDIENTE",
    estadoEnvio: "PENDIENTE",
  },
  {
    id: 1004,
    fecha: "2024-01-17T15:45:00Z",
    cliente: "Ana Martínez",
    total: 15600,
    estadoDespacho: "PENDIENTE",
    estadoCobro: "PROCESANDO",
    estadoEnvio: "PENDIENTE",
  },
]

const estadoColors = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PREPARANDO: "bg-blue-100 text-blue-800",
  DESPACHADO: "bg-purple-100 text-purple-800",
  EN_TRANSITO: "bg-orange-100 text-orange-800",
  ENTREGADO: "bg-green-100 text-green-800",
  COMPLETADO: "bg-green-100 text-green-800",
  PAGADO: "bg-green-100 text-green-800",
  PROCESANDO: "bg-blue-100 text-blue-800",
  RECHAZADO: "bg-red-100 text-red-800",
  DEVUELTO: "bg-red-100 text-red-800",
}

export default function AdminPage() {
  const [pedidos, setPedidos] = useState([])
  const [estadisticas, setEstadisticas] = useState({
    totalPedidos: 0,
    pedidosPendientes: 0,
    ventasHoy: 0,
    productosEnviados: 0,
  })

  useEffect(() => {
    setPedidos(pedidosAdmin)

    // Calcular estadísticas
    const stats = {
      totalPedidos: pedidosAdmin.length,
      pedidosPendientes: pedidosAdmin.filter(
        (p) => p.estadoDespacho === "PENDIENTE" || p.estadoCobro === "PENDIENTE" || p.estadoEnvio === "PENDIENTE",
      ).length,
      ventasHoy: pedidosAdmin.reduce((sum, p) => sum + p.total, 0),
      productosEnviados: pedidosAdmin.filter((p) => p.estadoEnvio === "ENTREGADO").length,
    }
    setEstadisticas(stats)
  }, [])

  const actualizarEstado = async (pedidoId, tipoEstado, nuevoEstado) => {
    try {
      // Simular llamada a microservicio correspondiente
      const endpoint = {
        despacho: "/api/despacho/actualizar",
        cobro: "/api/cobros/actualizar",
        envio: "/api/envios/actualizar",
      }[tipoEstado]

      // Actualizar estado local
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === pedidoId
            ? { ...pedido, [`estado${tipoEstado.charAt(0).toUpperCase() + tipoEstado.slice(1)}`]: nuevoEstado }
            : pedido,
        ),
      )

      console.log(`Actualizando ${tipoEstado} del pedido ${pedidoId} a ${nuevoEstado}`)
    } catch (error) {
      console.error("Error al actualizar estado:", error)
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <div className="flex space-x-4">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Link href="/">
              <Button variant="outline">Volver a Tienda</Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                  <p className="text-3xl font-bold">{estadisticas.totalPedidos}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{estadisticas.pedidosPendientes}</p>
                </div>
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
                  <p className="text-3xl font-bold text-green-600">${estadisticas.ventasHoy.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entregados</p>
                  <p className="text-3xl font-bold text-purple-600">{estadisticas.productosEnviados}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Despacho</TableHead>
                  <TableHead>Cobro</TableHead>
                  <TableHead>Envío</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">#{pedido.id}</TableCell>
                    <TableCell>{formatearFecha(pedido.fecha)}</TableCell>
                    <TableCell>{pedido.cliente}</TableCell>
                    <TableCell className="font-semibold text-green-600">${pedido.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select
                        value={pedido.estadoDespacho}
                        onValueChange={(valor) => actualizarEstado(pedido.id, "despacho", valor)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosDespacho.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              <Badge className={`${estadoColors[estado]} text-xs`}>{estado}</Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={pedido.estadoCobro}
                        onValueChange={(valor) => actualizarEstado(pedido.id, "cobro", valor)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosCobro.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              <Badge className={`${estadoColors[estado]} text-xs`}>{estado}</Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={pedido.estadoEnvio}
                        onValueChange={(valor) => actualizarEstado(pedido.id, "envio", valor)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosEnvio.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              <Badge className={`${estadoColors[estado]} text-xs`}>{estado}</Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Gestionar Pedido #{pedido.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Estado de Despacho</label>
                              <Select
                                value={pedido.estadoDespacho}
                                onValueChange={(valor) => actualizarEstado(pedido.id, "despacho", valor)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {estadosDespacho.map((estado) => (
                                    <SelectItem key={estado} value={estado}>
                                      {estado}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Estado de Cobro</label>
                              <Select
                                value={pedido.estadoCobro}
                                onValueChange={(valor) => actualizarEstado(pedido.id, "cobro", valor)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {estadosCobro.map((estado) => (
                                    <SelectItem key={estado} value={estado}>
                                      {estado}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Estado de Envío</label>
                              <Select
                                value={pedido.estadoEnvio}
                                onValueChange={(valor) => actualizarEstado(pedido.id, "envio", valor)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {estadosEnvio.map((estado) => (
                                    <SelectItem key={estado} value={estado}>
                                      {estado}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
