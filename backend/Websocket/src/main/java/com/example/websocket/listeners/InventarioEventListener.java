package com.example.websocket.listeners;

import com.example.websocket.handlers.InventarioWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class InventarioEventListener {

    private final InventarioWebSocketHandler webSocketHandler;
    private final ObjectMapper objectMapper;

    public InventarioEventListener(InventarioWebSocketHandler webSocketHandler, ObjectMapper objectMapper) {
        this.webSocketHandler = webSocketHandler;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = "inventario.actualizado.queue")
    public void handleProductoActualizado(Object event) {
        try {
            String mensaje = "{\"tipo\":\"INVENTARIO_ACTUALIZADO\"}";
            webSocketHandler.enviarMensaje(mensaje);
            System.out.println("🔁 Notificado INVENTARIO_ACTUALIZADO por WebSocket");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
