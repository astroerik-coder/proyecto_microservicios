import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Product } from "@/types/product";

interface InventarioClientProps {
  paginatedInventory: Product[];
  totalPages: number;
  page: number;
  setPage: (page: number | ((prevPage: number) => number)) => void;
  handleAddToCart: (product: Product) => void;
  defaultImage: string;
}

export function InventarioClient({
  paginatedInventory,
  totalPages,
  page,
  setPage,
  handleAddToCart,
  defaultImage,
}: InventarioClientProps) {
  return (
    <TabsContent value="products">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedInventory.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <img
              src={defaultImage}
              alt="Imagen del producto"
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-lg">{product.nombre}</CardTitle>
              <CardDescription>{product.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ${product.precio.toLocaleString()}
                </span>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0
                    ? `${product.stock} disponibles`
                    : "Agotado"}
                </Badge>
              </div>
              <Button
                className="w-full"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar al Carrito
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="px-2 self-center text-sm">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
