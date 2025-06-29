"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { pedidosAPI, despachosAPI, cobrosAPI } from "@/lib/api";
import {
  Pedido,
  PedidoRequest,
  PedidoCompleto,
  Despacho,
  Cobro,
} from "@/types/product";
import { useAuth } from "./use-auth";

interface OrdersContextType {
  pedidos: Pedido[];
  pedidosCompletos: PedidoCompleto[];
  loading: boolean;
  error: string | null;
  createPedido: (pedidoData: PedidoRequest) => Promise<void>;
  deletePedido: (pedidoId: number) => Promise<void>;
  updatePedidoEstado: (pedidoId: number, estado: string) => Promise<void>;
  approvePedido: (pedidoId: number) => Promise<void>;
  refreshPedidos: () => Promise<void>;
  // Funciones de despacho
  createDespacho: (pedidoId: number, observacion: string) => Promise<void>;
  avanzarDespacho: (despachoId: number) => Promise<void>;
  // Funciones de cobro
  createCobro: (
    pedidoId: number,
    monto: number,
    metodoPago: string,
    datosPago: any
  ) => Promise<void>;
  procesarCobro: (cobroId: number) => Promise<void>;
  // Función para cargar todos los pedidos (admin)
  loadAllPedidos: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosCompletos, setPedidosCompletos] = useState<PedidoCompleto[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadPedidosCompletos = async (pedidosData: Pedido[]) => {
    const completos: PedidoCompleto[] = [];

    // Validar que pedidosData sea un array
    if (!Array.isArray(pedidosData)) {
      console.error('pedidosData no es un array:', pedidosData);
      return completos;
    }

    for (const pedido of pedidosData) {
      try {
        // Obtener despacho del pedido
        let despacho: Despacho | undefined;
        try {
          const despachos = await despachosAPI.obtenerPorPedido(pedido.id);
          despacho = Array.isArray(despachos) && despachos.length > 0 ? despachos[0] : undefined;
        } catch (error) {
          console.log(`No hay despacho para pedido ${pedido.id}`);
        }

        // Obtener cobro del pedido
        let cobro: Cobro | undefined;
        try {
          cobro = await cobrosAPI.getCobroByPedidoId(pedido.id);
        } catch (error) {
          console.log(`No hay cobro para pedido ${pedido.id}`);
        }

        completos.push({
          ...pedido,
          despacho,
          cobro,
        });
      } catch (error) {
        console.error(
          `Error cargando datos completos del pedido ${pedido.id}:`,
          error
        );
        completos.push(pedido);
      }
    }

    return completos;
  };

  const loadPedidos = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const pedidosData = await pedidosAPI.getPedidosByCliente(user.id);
      
      // Validar que la respuesta sea un array
      const pedidosArray = Array.isArray(pedidosData) ? pedidosData : [];
      setPedidos(pedidosArray);

      // Cargar datos completos
      const completos = await loadPedidosCompletos(pedidosArray);
      setPedidosCompletos(completos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar pedidos");
      console.error("Error loading pedidos:", err);
      setPedidos([]);
      setPedidosCompletos([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllPedidos = async () => {
    setLoading(true);
    setError(null);

    try {
      const pedidosData = await pedidosAPI.getAllPedidos();
      
      // Validar que la respuesta sea un array
      const pedidosArray = Array.isArray(pedidosData) ? pedidosData : [];
      setPedidos(pedidosArray);

      // Cargar datos completos
      const completos = await loadPedidosCompletos(pedidosArray);
      setPedidosCompletos(completos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar todos los pedidos"
      );
      console.error("Error loading all pedidos:", err);
      setPedidos([]);
      setPedidosCompletos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.rol === "ADMIN") {
      loadAllPedidos();
    } else {
      loadPedidos();
    }
  }, [user]);

  const createPedido = async (pedidoData: PedidoRequest) => {
    if (!user) throw new Error("Usuario no autenticado");

    setLoading(true);
    setError(null);

    try {
      await pedidosAPI.createPedido(pedidoData);
      if (user.rol === "ADMIN") {
        await loadAllPedidos();
      } else {
        await loadPedidos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear pedido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePedido = async (pedidoId: number) => {
    setLoading(true);
    setError(null);

    try {
      await pedidosAPI.deletePedido(pedidoId);
      if (user?.rol === "ADMIN") {
        await loadAllPedidos();
      } else {
        await loadPedidos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar pedido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePedidoEstado = async (pedidoId: number, estado: string) => {
    setLoading(true);
    setError(null);

    try {
      await pedidosAPI.updatePedidoEstado(pedidoId, estado);
      if (user?.rol === "ADMIN") {
        await loadAllPedidos();
      } else {
        await loadPedidos();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar estado"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createDespacho = async (pedidoId: number, observacion: string) => {
    setLoading(true);
    setError(null);

    try {
      await despachosAPI.crearDespacho({
        idPedido: pedidoId,
        observaciones: observacion,
      });
      if (user?.rol === "ADMIN") {
        await loadAllPedidos();
      } else {
        await loadPedidos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear despacho");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const avanzarDespacho = async (despachoId: number) => {
    setLoading(true);
    setError(null);

    try {
      await despachosAPI.avanzarEstado(despachoId);
      if (user?.rol === "ADMIN") {
        await loadAllPedidos();
      } else {
        await loadPedidos();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al avanzar despacho"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCobro = async (
    pedidoId: number,
    monto: number,
    metodoPago: string,
    datosPago: any
  ) => {
    setLoading(true);
    setError(null);

    try {
      await cobrosAPI.createCobro({
        idPedido: pedidoId,
        monto,
        metodoPago,
        datosPago,
      });
      if (user?.rol === "ADMIN") {
        await loadAllPedidos();
      } else {
        await loadPedidos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cobro");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const procesarCobro = async (cobroId: number) => {
    setLoading(true);
    setError(null);

    try {
      await cobrosAPI.procesarCobro(cobroId);
      if (user?.rol === "ADMIN") {
        await loadAllPedidos();
      } else {
        await loadPedidos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar cobro");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshPedidos = async () => {
    if (user?.rol === "ADMIN") {
      await loadAllPedidos();
    } else {
      await loadPedidos();
    }
  };

  const approvePedido = async (pedidoId: number) => {
    setLoading(true);
    setError(null);

    try {
      await pedidosAPI.approvePedido(pedidoId);
      if (user?.rol === "ADMIN") {
        await loadAllPedidos();
      } else {
        await loadPedidos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aprobar pedido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        pedidos,
        pedidosCompletos,
        loading,
        error,
        createPedido,
        deletePedido,
        updatePedidoEstado,
        approvePedido,
        refreshPedidos,
        createDespacho,
        avanzarDespacho,
        createCobro,
        procesarCobro,
        loadAllPedidos,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
