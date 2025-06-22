"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Package, LogOut, Plus, Minus, CreditCard, History } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useOrders } from "@/hooks/use-orders"
import { useInventory } from "@/hooks/use-inventory"
import { useCart } from "@/hooks/use-cart"
import PaymentModal from "@/components/payment-modal"
import AlertModal from "@/components/alert-modal"

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const { orders } = useOrders()
  const { inventory } = useInventory()
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal } = useCart()
  const [showPayment, setShowPayment] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: "", title: "", message: "" })

  const userOrders = orders.filter((order) => order.customerId === user?.id)

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product)
      setAlert({
        show: true,
        type: "success",
        title: "Producto Agregado",
        message: `${product.name} ha sido agregado al carrito.`,
      })
    }
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      setAlert({
        show: true,
        type: "error",
        title: "Carrito Vacío",
        message: "Agrega productos al carrito antes de proceder al pago.",
      })
      return
    }
    setShowPayment(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      processing: { label: "Procesando", variant: "default" as const },
      ready_to_ship: { label: "Listo para Envío", variant: "outline" as const },
      shipped: { label: "Enviado", variant: "default" as const },
      completed: { label: "Completado", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    }

    const config = statusConfig[status] || statusConfig.pending

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tienda Online</h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Carrito ({cart.length})
                </Button>
              </div>
              <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="cart">Carrito ({cart.length})</TabsTrigger>
            <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inventory.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>SKU: {product.sku}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-green-600">${product.price.toLocaleString()}</span>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
                      </Badge>
                    </div>
                    <Button className="w-full" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar al Carrito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cart">
            <Card>
              <CardHeader>
                <CardTitle>Carrito de Compras</CardTitle>
                <CardDescription>Revisa tus productos antes de proceder al pago</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                            <p className="text-lg font-bold text-green-600">${item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="mx-2 font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(item)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold">Total:</span>
                        <span className="text-2xl font-bold text-green-600">${getCartTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={clearCart} className="flex-1">
                          Vaciar Carrito
                        </Button>
                        <Button onClick={handleCheckout} className="flex-1 bg-green-600 hover:bg-green-700">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Proceder al Pago
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Mis Pedidos</CardTitle>
                <CardDescription>Historial de tus pedidos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No tienes pedidos realizados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">Pedido #{order.id}</h3>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{order.items.length} producto(s)</span>
                          <span className="font-bold text-green-600">${order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showPayment && (
        <PaymentModal
          total={getCartTotal()}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false)
            clearCart()
            setAlert({
              show: true,
              type: "success",
              title: "Pago Exitoso",
              message: "Tu pedido ha sido procesado correctamente.",
            })
          }}
        />
      )}

      <AlertModal
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ show: false, type: "", title: "", message: "" })}
      />
    </div>
  )
}
