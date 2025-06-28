package com.example.demo.services.Publisher;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.models.dto.PedidoListoParaPagarEvent;

@Service
public class PedidoListoParaPagarPublisher {

    private final RabbitTemplate rabbitTemplate;

    public PedidoListoParaPagarPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicar(Long idPedido) {
        PedidoListoParaPagarEvent evento = new PedidoListoParaPagarEvent(idPedido);
        rabbitTemplate.convertAndSend(
            "pedido.exchange",
            "pedido.listo_para_pagar",
            evento
        );
        System.out.println("📤 Enviado evento 'pedido.listo_para_pagar' para pedido: " + idPedido);
    }
}