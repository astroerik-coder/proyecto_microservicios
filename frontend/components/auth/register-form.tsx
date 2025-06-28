"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function RegisterForm() {
  const { register } = useAuth()

  const [form, setForm] = useState({
    nombreUsuario: "",
    correo: "",
    contraseña: "",
    telefono: "",
    direccion: "",
    cedula: "",
    genero: "",
    imagenUrl: "",
    fechaNacimiento: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register({ ...form })
    } catch (err: any) {
      alert("Error al registrarse: " + err.message)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Package className="h-6 w-6" />
            Registro de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["nombreUsuario", "Nombre de Usuario"],
                ["correo", "Correo Electrónico", "email"],
                ["contraseña", "Contraseña", "password"],
                ["telefono", "Teléfono"],
                ["direccion", "Dirección"],
                ["cedula", "Cédula"],
                ["genero", "Género"],
                ["fechaNacimiento", "Fecha de Nacimiento", "date"],
                ["imagenUrl", "URL de Imagen"]
              ].map(([name, label, type = "text"]) => (
                <div key={name} className={`${name === "imagenUrl" ? "md:col-span-2" : ""} space-y-2`}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    required={["nombreUsuario", "correo", "contraseña"].includes(name)}
                  />
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Registrarse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
