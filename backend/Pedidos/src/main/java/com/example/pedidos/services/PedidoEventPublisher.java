package com.example.pedidos.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.pedidos.config.RabbitMQConfig;
import com.example.pedidos.models.Pedido;
import com.example.pedidos.models.dto.LineaPedidoDTO;
import com.example.pedidos.models.dto.PedidoEvent;

@Service
public class PedidoEventPublisher {

    @Autowired
    private AmqpTemplate amqpTemplate;
    private final RabbitTemplate rabbit;

    public PedidoEventPublisher(RabbitTemplate rabbit) {
        this.rabbit = rabbit;
    }

    public void publishCreated(Pedido pedido) {
        PedidoEvent evt = mapToEvent(pedido);
        rabbit.convertAndSend(
                RabbitMQConfig.PEDIDO_EXCHANGE,
                RabbitMQConfig.PEDIDO_CREATED_ROUTING_KEY,
                evt);
    }

    public void publishRelease(Pedido pedido) {
        PedidoEvent evt = mapToEvent(pedido);
        rabbit.convertAndSend(
                RabbitMQConfig.PEDIDO_EXCHANGE,
                RabbitMQConfig.PEDIDO_ROUTING_RELEASE,
                evt);
    }

    private PedidoEvent mapToEvent(Pedido p) {
        PedidoEvent e = new PedidoEvent();
        e.setId(p.getId());
        e.setIdCliente(p.getIdCliente());
        e.setTotal(p.getTotal());
        // Por ahora, las líneas están vacías ya que Pedido no tiene items
        e.setLineas(List.of());
        return e;
    }

    public void publicarPedidoCreado(Pedido pedido) {
        amqpTemplate.convertAndSend(
                RabbitMQConfig.PEDIDO_EXCHANGE,
                RabbitMQConfig.PEDIDO_CREATED_ROUTING_KEY,
                pedido // O un DTO/JSON personalizado si lo prefieres
        );
        System.out.println("📤 Evento de pedido creado publicado.");
    }
}