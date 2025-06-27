package com.example.pedidos.services.Publisher;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.pedidos.config.RabbitMQConfig;
import com.example.pedidos.models.dto.ProductoConsultaEvent;

/**
 * Publicador de eventos RabbitMQ que solicita información de productos al
 * microservicio de inventario.
 * 
 * Este servicio se usa inmediatamente después de crear un nuevo pedido, cuando
 * los detalles aún no tienen:
 * - nombre del producto
 * - precio unitario
 * 
 * Envía un mensaje por cada producto incluido en el pedido a la cola esperada
 * por inventario.
 */
@Service
public class ProductoConsultaPublisher {

    // Inyección de RabbitTemplate para publicar mensajes
    @Autowired
    private RabbitTemplate rabbit;

    public void publicarSolicitud(Long idPedido, Long idProducto, Integer cantidad) {
        // Crear el objeto evento con los datos mínimos necesarios
        ProductoConsultaEvent evt = new ProductoConsultaEvent();
        evt.setIdPedido(idPedido);
        evt.setIdProducto(idProducto);
        evt.setCantidad(cantidad);

        // Enviar el mensaje al exchange, con la routing key correspondiente
        rabbit.convertAndSend(
                RabbitMQConfig.EXCHANGE_PEDIDO, // Exchange de pedidos
                RabbitMQConfig.ROUTING_PRODUCTO_CONSULTA, // Routing key para consulta de productos
                evt // Cuerpo del mensaje (serializado como JSON)
        );

        System.out.println("📤 producto.consultar publicado: " + idProducto);
    }

    /**
     * Publica una solicitud para disminuir el stock de un producto en inventario.
     * Se usa inmediatamente después de crear un pedido para reservar cantidades.
     */
    public void publicarDisminucionStock(Long idProducto, Integer cantidad) {
        ProductoConsultaEvent evt = new ProductoConsultaEvent();
        evt.setIdProducto(idProducto);
        evt.setCantidad(cantidad);

        rabbit.convertAndSend(
                RabbitMQConfig.EXCHANGE_PEDIDO,
                RabbitMQConfig.ROUTING_STOCK_DISMINUIR,
                evt);

        System.out.println("📤 stock.disminuir publicado para producto: " + idProducto);
    }
}
