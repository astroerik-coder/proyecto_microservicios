package com.example.demo.services.Publisher;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.models.dto.PagoExitosoEvent;

@Service
public class PagoExitosoPublisher {

    private final RabbitTemplate rabbitTemplate;

    public PagoExitosoPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicar(Long idPedido) {
        PagoExitosoEvent evento = new PagoExitosoEvent(idPedido);
        rabbitTemplate.convertAndSend("pedido.exchange", "pago.exitoso", evento);
        System.out.println("📤 Evento 'pago.exitoso' enviado para pedido: " + idPedido);
    }
}