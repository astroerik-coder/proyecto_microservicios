package com.example.demo.services;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.config.RabbitMQConfig;
import com.example.demo.models.Pedido;

@Service
public class PedidoEventPublisher {

    @Autowired
    private AmqpTemplate amqpTemplate;

    public void publicarPedidoCreado(Pedido pedido) {
        amqpTemplate.convertAndSend(
            RabbitMQConfig.PEDIDO_EXCHANGE,
            RabbitMQConfig.PEDIDO_CREATED_ROUTING_KEY,
            pedido // O un DTO/JSON personalizado si lo prefieres
        );
        System.out.println("📤 Evento de pedido creado publicado.");
    }
}