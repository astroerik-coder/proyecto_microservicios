package com.example.detallePedidos.services;

import java.util.List;
import java.util.Optional;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.detallePedidos.config.RabbitMQConfig;
import com.example.detallePedidos.models.DetallePedido;
import com.example.detallePedidos.models.dtos.ProductoInfoEvent;
import com.example.detallePedidos.repositories.DetallePedidoRepository;

@Service
public class ProductoInfoListener {

    @Autowired
    private DetallePedidoRepository detalleRepo;

    @Autowired
    private PedidoRecalculoPublisher recalculoPublisher;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PRODUCTO_INFO)
    public void handleProductoInfo(ProductoInfoEvent evento) {
        System.out.println("📥 producto.info recibido: " + evento.getIdProducto());

        // Buscar el detalle correspondiente
        List<DetallePedido> detalles = detalleRepo.findByIdPedidoAndEliminadoFalse(evento.getIdPedido());

        // Buscar el detalle exacto
        Optional<DetallePedido> detalleOpt = detalles.stream()
            .filter(d -> d.getIdProducto().equals(evento.getIdProducto()))
            .findFirst();

        if (detalleOpt.isPresent()) {
            DetallePedido detalle = detalleOpt.get();
            detalle.setNombreProducto(evento.getNombreProducto());
            detalle.setPrecioUnitario(evento.getPrecioUnitario());
            detalle.setSubtotal(detalle.getCantidad() * evento.getPrecioUnitario());
            detalleRepo.save(detalle);
        } else {
            System.out.println("⚠️ Detalle no encontrado para producto " + evento.getIdProducto());
            return;
        }

        // Verificar si ya están todos los productos completos
        List<DetallePedido> actualizados = detalleRepo.findByIdPedidoAndEliminadoFalse(evento.getIdPedido());

        boolean incompleto = actualizados.stream()
            .anyMatch(d -> d.getPrecioUnitario() == null || d.getPrecioUnitario() == 0.0);

        if (!incompleto) {
            // Calcular total
            double total = actualizados.stream()
                .mapToDouble(DetallePedido::getSubtotal)
                .sum();

            recalculoPublisher.publicarRecalculo(evento.getIdPedido(), total);
        }
    }
}