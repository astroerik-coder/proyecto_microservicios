"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { inventarioAPI } from "@/lib/api";
import { useInventarioSocket } from "@/hooks/use-inventario-socket";
import ModalAgregarProducto from "@/components/inventario/inventario-add-form";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

const PAGE_SIZE = 5;

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Anterior
      </Button>
      <span className="px-2">
        Página {page} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Siguiente
      </Button>
    </div>
  );
}

export function InventarioTab() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Product | null>(
    null
  );

  const fetchData = async (pagina: number = page - 1) => {
    try {
      const res = await inventarioAPI.getInventory(pagina, PAGE_SIZE);
      const productosActivos = res.content.filter((p: Product) => !p.eliminado);

      setInventory(productosActivos);
      setFiltered(productosActivos);
      setTotalPages(res.totalPages);
      setPage(res.number + 1);
    } catch (error) {
      console.error("❌ Error al obtener inventario:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  useInventarioSocket(() => {
    toast({
      title: "Inventario actualizado",
      description: "Un producto ha sido modificado.",
    });
    fetchData(page - 1);
  });

  useEffect(() => {
    const resultados = inventory.filter((item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(resultados);
  }, [search, inventory]);

  const handleDelete = async (id: number) => {
    try {
      await inventarioAPI.deleteInventoryByID(id.toString());
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      });
      fetchData(page - 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  return (
    <TabsContent value="inventory">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle>Inventario</CardTitle>
            <CardDescription>Gestiona el stock de productos</CardDescription>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={() => setShowForm(true)}>+ Agregar</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nombre}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <span
                      className={
                        item.stock < 10 ? "text-red-600 font-semibold" : ""
                      }
                    >
                      {item.stock} unidades
                    </span>
                  </TableCell>
                  <TableCell>${item.precio.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.stock > 0 ? "default" : "destructive"}>
                      {item.stock > 0 ? "Disponible" : "Agotado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setProductoEditando(item);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        item.id !== undefined && handleDelete(item.id)
                      }
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-end mt-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  fetchData(newPage - 1);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ModalAgregarProducto
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setProductoEditando(null);
        }}
        onSuccess={() => fetchData(page - 1)}
        producto={productoEditando}
      />
    </TabsContent>
  );
}
