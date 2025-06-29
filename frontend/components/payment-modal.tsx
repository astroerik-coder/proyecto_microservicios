"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Lock, CheckCircle, XCircle } from "lucide-react"

interface PaymentModalProps {
  total: number
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentModal({ total, onClose, onSuccess }: PaymentModalProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    paymentMethod: "credit",
  })
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
        onSuccess()
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
                <h3 className="text-xl font-bold text-green-600 mb-2">¡Pedido Enviado!</h3>
                <p className="text-gray-600">Tu pedido ha sido enviado y está pendiente de aprobación</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-600 mb-2">Error al Enviar</h3>
                <p className="text-gray-600">Hubo un problema al enviar el pedido</p>
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
            Enviar Pedido para Aprobación
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
            <CardDescription>
              Total del pedido: <span className="text-2xl font-bold text-green-600">${total.toLocaleString()}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Método de Pago</Label>
              <Select
                value={paymentData.paymentMethod}
                onValueChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="debit">Tarjeta de Débito</SelectItem>
                  <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-holder">Nombre del Titular</Label>
              <Input
                id="card-holder"
                placeholder="Juan Pérez"
                value={paymentData.cardHolder}
                onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-number">Número de Tarjeta</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Fecha de Vencimiento</Label>
                <Input
                  id="expiry"
                  placeholder="MM/AA"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <Lock className="w-4 h-4" />
              <span>Tu información está protegida con encriptación SSL</span>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handlePayment} disabled={processing} className="flex-1 bg-green-600 hover:bg-green-700">
                {processing ? "Enviando..." : `Enviar Pedido`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
