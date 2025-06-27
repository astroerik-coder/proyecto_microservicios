package com.example.inventario.services.Publisher;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventario.config.RabbitMQConfig;
import com.example.inventario.models.dto.ProductoInfoEvent;

/**
 * Publicador de eventos RabbitMQ que responde con la información de un producto
 * solicitado por el microservicio de pedidos.
 *
 * Este evento se genera como respuesta a un "producto.consultar", y contiene:
 * - ID del pedido que hizo la solicitud
 * - ID del producto consultado
 * - Nombre del producto
 * - Precio unitario
 *
 * Este mensaje permite que el microservicio de pedidos complete sus detalles
 * y avance el estado del pedido.
 */
@Service
public class ProductoInfoPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publicarInfoProducto(Long idPedido, Long idProducto, String nombre, Double precio) {
        // Crear el mensaje con la información del producto
        ProductoInfoEvent evento = new ProductoInfoEvent();
        evento.setIdPedido(idPedido);
        evento.setIdProducto(idProducto);
        evento.setNombreProducto(nombre);
        evento.setPrecioUnitario(precio);

        // Publicar al exchange con la routing key correspondiente
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,      // Exchange compartido entre servicios
            "producto.info",              // Routing key que escucha el micro de pedidos
            evento                        // Mensaje con los datos del producto
        );

        System.out.println("📤 producto.info publicado para producto: " + idProducto);
    }
}
