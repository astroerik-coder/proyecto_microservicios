package com.example.pedidos.services.Listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.example.pedidos.config.RabbitMQConfig;
import com.example.pedidos.models.dto.PagoExitosoEvent;
import com.example.pedidos.repositories.PedidoRepository;

@Service
public class PagoExitosoListener {

    private final PedidoRepository pedidoRepository;

    public PagoExitosoListener(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PAGO_EXITOSO)
    public void handlePagoExitoso(PagoExitosoEvent evento) {
        System.out.println("📥 Recibido evento 'pago.exitoso' para pedido " + evento.getIdPedido());

        pedidoRepository.findById(evento.getIdPedido()).ifPresent(pedido -> {
            if ("Listo para pagar".equalsIgnoreCase(pedido.getEstado())) {
                pedido.setEstado("Enviado");
                pedidoRepository.save(pedido);
                System.out.println("✅ Estado actualizado a 'Enviado'");
            } else {
                System.out.println("⚠️ Estado actual no válido para avanzar: " + pedido.getEstado());
            }
        });
    }
}