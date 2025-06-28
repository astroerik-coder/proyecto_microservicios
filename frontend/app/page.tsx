"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("login");

  useEffect(() => {
    console.log("Verificando redirección. Usuario:", user);

    if (user?.role === "ADMIN") {
      console.log("Redirigiendo a /admin");
      router.replace("/admin");
    } else if (user?.role === "CLIENTE") {
      console.log("Redirigiendo a /cliente");
      router.replace("/cliente");

      window.location.href = "/cliente";
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 transition-all">
      <Card
        className={`w-full transition-all duration-300 ${
          tab === "register" ? "max-w-4xl" : "max-w-md"
        }`}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Distribuidora Pedrito DEV
          </CardTitle>
          <CardDescription>Sistema de Gestión de Pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            value={tab}
            onValueChange={setTab}
            className="w-full space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
