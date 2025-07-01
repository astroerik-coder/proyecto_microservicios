"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, CheckCircle, XCircle } from "lucide-react"

interface PaymentModalProps {
  total: number
  onClose: () => void
  onSuccess: (referenciaPago?: string, metodoPago?: string) => void
}

export default function PaymentModal({ total, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("EFECTIVO")
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<"success" | "error" | null>(null)

  const handlePayment = async () => {
    setProcessing(true)

    // Simulación de procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulación de éxito/fallo aleatorio (80% éxito)
    const success = Math.random() > 0.2

    setResult(success ? "success" : "error")
    setProcessing(false)

    if (success) {
      setTimeout(() => {
        // Generar referencia automática
        const referenciaPago = `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        onSuccess(referenciaPago, paymentMethod)
      }, 1500)
    }
  }

  if (result) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            {result === "success" ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 mb-2">¡Pago Realizado!</h3>
                <p className="text-gray-600">El pago se ha procesado correctamente</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-600 mb-2">Error en el Pago</h3>
                <p className="text-gray-600">Hubo un problema al procesar el pago</p>
                <Button className="mt-4" onClick={() => setResult(null)}>
                  Intentar Nuevamente
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Realizar Pago
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen del Pago</CardTitle>
            <CardDescription>
              Total a pagar: <span className="text-2xl font-bold text-green-600">${total.toLocaleString()}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Pago</label>
              <Select
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="TARJETA">Tarjeta de Crédito/Débito</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferencia Bancaria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Referencia de pago:</strong> Se generará automáticamente
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handlePayment} disabled={processing} className="flex-1 bg-green-600 hover:bg-green-700">
                {processing ? "Procesando..." : `Pagar $${total.toLocaleString()}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
