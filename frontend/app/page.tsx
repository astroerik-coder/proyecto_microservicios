"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Users, Package } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import AdminDashboard from "@/components/admin-dashboard"
import ClientDashboard from "@/components/client-dashboard"

export default function HomePage() {
  const { user, login, logout } = useAuth()
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })

  const handleLogin = async (role: "admin" | "client") => {
    // Simulación de login
    const mockUser = {
      id: role === "admin" ? "1" : "2",
      email: loginForm.email || (role === "admin" ? "admin@distribuidora.com" : "cliente@email.com"),
      name: role === "admin" ? "Administrador" : "Cliente",
      role: role,
    }
    login(mockUser)
  }

  if (user) {
    return user.role === "admin" ? <AdminDashboard /> : <ClientDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Distribuidora XYZ</CardTitle>
          <CardDescription>Sistema de Gestión de Pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cliente
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password">Contraseña</Label>
                <Input
                  id="client-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleLogin("client")}>
                Ingresar como Cliente
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@distribuidora.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Contraseña</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleLogin("admin")}>
                Ingresar como Administrador
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
