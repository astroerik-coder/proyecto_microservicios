import { ShoppingCart, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderClienteProps {
  user: { nombreUsuario?: string } | null;
  cartLength: number;
  onLogout: () => void;
}

export default function HeaderCliente({
  user,
  cartLength,
  onLogout,
}: HeaderClienteProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tienda Online
              </h1>
              <p className="text-sm text-gray-500">
                Bienvenido, {user?.nombreUsuario}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Carrito ({cartLength})
              </Button>
            </div>
            <Link href="/tracking">
              <Button variant="outline" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Seguimiento
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
