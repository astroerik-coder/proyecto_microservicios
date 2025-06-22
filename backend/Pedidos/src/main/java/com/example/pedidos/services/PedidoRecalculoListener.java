package com.example.pedidos.services;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.models.dto.PedidoRecalculoEvent;
import com.example.pedidos.repositories.PedidoRepository;
import com.example.pedidos.state.EstadoFactory;
import com.example.pedidos.state.EstadoPedidoState;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import java.util.Optional;

import static com.example.pedidos.config.RabbitMQConfig.PEDIDO_RECALCULO_QUEUE;

@Service
public class PedidoRecalculoListener {

    private final PedidoRepository pedidoRepository;

    public PedidoRecalculoListener(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @RabbitListener(queues = PEDIDO_RECALCULO_QUEUE)
    public void handlePedidoRecalculo(PedidoRecalculoEvent evento) {
        System.out.println("📥 pedido.recalcular_total recibido para pedido ID: " + evento.getIdPedido());

        Optional<Pedido> optional = pedidoRepository.findById(evento.getIdPedido());

        if (optional.isEmpty()) {
            System.out.println("❌ Pedido no encontrado.");
            return;
        }

        Pedido pedido = optional.get();
        pedido.setTotal(evento.getNuevoTotal());

        // Avanzar estado con patrón State
        EstadoPedidoState estado = EstadoFactory.getEstado(pedido);
        estado.avanzar(pedido); // esto lo cambiará a "Procesando"

        pedidoRepository.save(pedido);

        System.out.println("✅ Pedido actualizado con nuevo total y estado: " + pedido.getEstado());
    }
}