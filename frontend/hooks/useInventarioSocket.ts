// lib/hooks/useInventarioSocket.ts
import { useEffect, useRef } from 'react';
import { inventarioAPI } from '@/lib/api';

type Callback = (data: any) => void;

export const useInventarioSocket = (onMessage: Callback) => {
  const reconnectAttempts = useRef(0);
  const maxAttempts = 5;
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFallback = async () => {
      try {
        const data = await inventarioAPI.getInventory();
        onMessage(data);
        console.warn('⚠️ WebSocket inactivo. Se usó fallback REST');
      } catch (err) {
        console.error('❌ Fallback REST falló:', err);
      }
    };

    const connect = () => {
      const ws = new WebSocket('ws://localhost:8089/ws/inventario');
      socketRef.current = ws;

      ws.onopen = () => {
        reconnectAttempts.current = 0;
        console.log('🔌 WebSocket inventario conectado');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch {
          console.warn('📦 Mensaje WebSocket inválido:', event.data);
        }
      };

      ws.onerror = () => {
        console.error('❌ WebSocket inventario error');
      };

      ws.onclose = () => {
        console.warn('🔌 WebSocket cerrado');
        if (!isMounted) return;

        reconnectAttempts.current += 1;
        if (reconnectAttempts.current <= maxAttempts) {
          setTimeout(connect, 3000);
        } else {
          fetchFallback();
        }
      };
    };

    connect();

    return () => {
      isMounted = false;
      socketRef.current?.close();
    };
  }, [onMessage]);
};
