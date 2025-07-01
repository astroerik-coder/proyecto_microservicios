import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader as CardHeaderUI, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartSummaryModalProps {
  cart: Array<{ id: string; name: string; price: number; quantity: number; sku: string }>;
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CartSummaryModal({ cart, total, onClose, onConfirm }: CartSummaryModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Resumen del Pedido
          </DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeaderUI>
            <CardTitle className="text-lg">Productos en el Carrito</CardTitle>
            <CardDescription>
              Total del pedido: <span className="text-2xl font-bold text-green-600">${total.toLocaleString()}</span>
            </CardDescription>
          </CardHeaderUI>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Cantidad: {item.quantity}</div>
                    <div className="text-green-600 font-bold">${item.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={onConfirm} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Confirmar Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
} 