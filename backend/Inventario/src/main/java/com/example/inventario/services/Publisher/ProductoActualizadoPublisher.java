package com.example.inventario.services.Publisher;

import com.example.inventario.config.RabbitMQConfig;
import com.example.inventario.models.Producto;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

/**
 * Publicador de eventos RabbitMQ que notifica a otros servicios
 * cuando un producto ha sido actualizado.
 *
 * Este evento puede ser útil para sistemas de:
 * - catálogos
 * - reportes
 * - sincronización con plataformas externas
 * - alertas sobre cambios de precios
 */
@Service
public class ProductoActualizadoPublisher {

    private final RabbitTemplate rabbitTemplate;

    public ProductoActualizadoPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Publica un evento con el estado completo del producto actualizado.
     * 
     * Este evento se envía utilizando la routing key "producto.actualizado",
     * que puede ser consumida por cualquier microservicio interesado.
     *
     * @param producto El objeto Producto con los cambios ya aplicados.
     */
    public void publicarProductoActualizado(Producto producto) {
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,         // Exchange compartido del sistema
            "producto.actualizado",          // Routing key específica del evento
            producto                         // Cuerpo del mensaje: el producto completo
        );

        System.out.println("📤 Evento producto.actualizado enviado para producto ID: " + producto.getId());
    }
}
