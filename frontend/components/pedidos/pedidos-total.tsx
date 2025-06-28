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

export function PedidosTab() {
  return (
    <TabsContent value="orders">
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
          <CardDescription>
            Gestiona y actualiza el estado de los pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(order.id, "processing")
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Procesar
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(order.id, "ready_to_ship")
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Listo
                        </Button>
                      )}
                      {order.status === "ready_to_ship" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(order.id, "shipped")
                          }
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Enviar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
