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

import { inventarioAPI } from "@/lib/api";

const PAGE_SIZE = 5;

type InventarioItem = {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  eliminado?: boolean;
};

export function InventarioTab() {
  const [inventory, setInventory] = useState<InventarioItem[]>([]);
  const [filtered, setFiltered] = useState<InventarioItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const productos = await inventarioAPI.getInventory();
      const activos = productos.filter((p: InventarioItem) => !p.eliminado);
      setInventory(activos);
      setFiltered(activos);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = inventory.filter((item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
    setPage(1);
  }, [search, inventory]);

  const paginatedItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

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
            />
            <Button onClick={() => alert("Agregar producto")}>+ Agregar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex justify-end mt-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
