package com.example.detallePedidos.services;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.detallePedidos.config.RabbitMQConfig;
import com.example.detallePedidos.models.dtos.PedidoRecalculoEvent;

@Service
public class PedidoRecalculoPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publicarRecalculo(Long idPedido, Double nuevoTotal) {
        PedidoRecalculoEvent evt = new PedidoRecalculoEvent();
        evt.setIdPedido(idPedido);
        evt.setNuevoTotal(nuevoTotal);

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.PEDIDO_EXCHANGE,
            RabbitMQConfig.ROUTING_RECALCULAR_PEDIDO,
            evt
        );

        System.out.println("📤 pedido.recalcular_total publicado: " + nuevoTotal);
    }
}