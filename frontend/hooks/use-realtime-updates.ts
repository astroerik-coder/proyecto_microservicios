"use client";

import { useEffect, useRef, useCallback } from "react";
import { useOrders } from "./use-orders";
import { useAuth } from "./use-auth";

interface UpdateCallback {
  (data: any): void;
}

export function useRealtimeUpdates() {
  const { user } = useAuth();
  const { refreshPedidos } = useOrders();
  const updateCallbacks = useRef<Map<string, UpdateCallback[]>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para registrar callbacks de actualización
  const registerUpdateCallback = useCallback((key: string, callback: UpdateCallback) => {
    if (!updateCallbacks.current.has(key)) {
      updateCallbacks.current.set(key, []);
    }
    updateCallbacks.current.get(key)!.push(callback);

    // Retornar función para desregistrar
    return () => {
      const callbacks = updateCallbacks.current.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }, []);

  // Función para ejecutar callbacks específicos
  const executeCallbacks = useCallback((key: string, data?: any) => {
    const callbacks = updateCallbacks.current.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }, []);

  // Función para actualizar solo pedidos específicos
  const updateSpecificPedido = useCallback(async (pedidoId: number) => {
    try {
      // Aquí podrías hacer una llamada específica para obtener solo ese pedido
      // Por ahora, refrescamos todos los pedidos pero solo ejecutamos callbacks específicos
      await refreshPedidos();
      executeCallbacks(`pedido-${pedidoId}`);
    } catch (error) {
      console.error('Error updating specific pedido:', error);
    }
  }, [refreshPedidos, executeCallbacks]);

  // Función para actualizar solo despachos
  const updateDespachos = useCallback(async () => {
    try {
      await refreshPedidos();
      executeCallbacks('despachos');
    } catch (error) {
      console.error('Error updating despachos:', error);
    }
  }, [refreshPedidos, executeCallbacks]);

  // Función para actualizar solo cobros
  const updateCobros = useCallback(async () => {
    try {
      await refreshPedidos();
      executeCallbacks('cobros');
    } catch (error) {
      console.error('Error updating cobros:', error);
    }
  }, [refreshPedidos, executeCallbacks]);

  // Función para actualizar estadísticas
  const updateStats = useCallback(async () => {
    try {
      await refreshPedidos();
      executeCallbacks('stats');
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }, [refreshPedidos, executeCallbacks]);

  // Configurar actualizaciones automáticas solo si es admin
  useEffect(() => {
    if (user?.rol === "ADMIN") {
      // Actualizar cada 30 segundos
      intervalRef.current = setInterval(() => {
        refreshPedidos();
      }, 30000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [user?.rol, refreshPedidos]);

  return {
    registerUpdateCallback,
    executeCallbacks,
    updateSpecificPedido,
    updateDespachos,
    updateCobros,
    updateStats,
  };
} 