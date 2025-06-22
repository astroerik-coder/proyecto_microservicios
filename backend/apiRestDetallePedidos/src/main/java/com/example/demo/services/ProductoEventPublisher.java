package com.example.demo.services;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.config.RabbitMQConfig;
import com.example.demo.models.dtos.ProductoConsultaEvent;

@Service
public class ProductoEventPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publicarSolicitudProducto(Long idPedido, Long idProducto, Integer cantidad) {
        ProductoConsultaEvent evt = new ProductoConsultaEvent();
        evt.setIdPedido(idPedido);
        evt.setIdProducto(idProducto);
        evt.setCantidad(cantidad);

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.PEDIDO_EXCHANGE,
            RabbitMQConfig.PRODUCTO_CONSULTA_ROUTING_KEY,
            evt
        );

        System.out.println("📤 Publicado producto.consultar para producto " + idProducto);
    }
}