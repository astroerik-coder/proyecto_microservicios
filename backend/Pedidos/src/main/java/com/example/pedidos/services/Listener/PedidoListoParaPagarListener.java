package com.example.pedidos.services.Listener;

import com.example.pedidos.models.dto.PedidoListoParaPagarEvent;
import com.example.pedidos.repositories.PedidoRepository;
import com.example.pedidos.config.RabbitMQConfig;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class PedidoListoParaPagarListener {

    private final PedidoRepository pedidoRepository;

    public PedidoListoParaPagarListener(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_LISTO_PARA_PAGAR)
    public void handlePedidoListoParaPagar(PedidoListoParaPagarEvent evento) {
        System.out.println("📥 Recibido evento 'pedido.listo_para_pagar' para pedido " + evento.getIdPedido());

        pedidoRepository.findById(evento.getIdPedido()).ifPresent(pedido -> {
            if ("Listo para despachar".equalsIgnoreCase(pedido.getEstado())) {
                pedido.setEstado("Listo para pagar");
                pedidoRepository.save(pedido);
                System.out.println("✅ Estado actualizado a 'Listo para pagar'");
            } else {
                System.out.println("⚠️ Estado no válido: " + pedido.getEstado());
            }
        });
    }
}