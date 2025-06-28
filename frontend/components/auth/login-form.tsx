"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login({
        nombreUsuario: form.email,
        contraseña: form.password,
      });

      const perfil = await authAPI.perfil();
      if (perfil.rol === "ADMIN") router.replace("/admin");
      else if (perfil.rol === "CLIENTE") router.replace("/cliente");
    } catch (err: any) {
      alert("Error al iniciar sesión: " + err.message);
    }
  };
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="usuario@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={handleLogin}
      >
        Iniciar Sesión
      </Button>
    </>
  );
}
