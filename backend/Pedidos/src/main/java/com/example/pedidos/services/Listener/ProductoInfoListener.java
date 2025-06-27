package com.example.pedidos.services.Listener;

import java.util.List;
import java.util.Optional;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.pedidos.config.RabbitMQConfig;
import com.example.pedidos.models.DetallePedido;
import com.example.pedidos.models.Pedido;
import com.example.pedidos.models.dto.ProductoInfoEvent;
import com.example.pedidos.repositories.DetallePedidoRepository;
import com.example.pedidos.repositories.PedidoRepository;
import com.example.pedidos.state.EstadoFactory;
import com.example.pedidos.state.EstadoPedidoState;

/**
 * Listener que se activa cuando llega un mensaje de tipo "producto.info" desde el microservicio de inventario.
 * Este mensaje contiene información faltante de un producto en un pedido (nombre y precio).
 * 
 * Objetivo:
 * - Completar el detalle del producto.
 * - Recalcular el total del pedido cuando todos los productos estén completos.
 * - Avanzar automáticamente el estado del pedido.
 */
@Service
public class ProductoInfoListener {

    @Autowired
    private DetallePedidoRepository detalleRepo;

    @Autowired
    private PedidoRepository pedidoRepo;

    /**
     * Escucha la cola "producto.info.queue" y procesa el evento recibido.
     * El evento contiene: idPedido, idProducto, nombreProducto, precioUnitario.
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE_PRODUCTO_INFO)
    public void handleProductoInfo(ProductoInfoEvent evento) {
        System.out.println("📥 producto.info recibido para producto " + evento.getIdProducto());

        // Busca todos los detalles del pedido correspondiente
        List<DetallePedido> detalles = detalleRepo.findByPedidoIdAndEliminadoFalse(evento.getIdPedido());

        // Encuentra el detalle específico que coincide con el producto informado
        Optional<DetallePedido> detalleOpt = detalles.stream()
                .filter(d -> d.getIdProducto().equals(evento.getIdProducto()))
                .findFirst();

        // Si no lo encuentra, termina
        if (detalleOpt.isEmpty()) {
            System.out.println("⚠️ Detalle no encontrado.");
            return;
        }

        // Completa la información del producto en el detalle
        DetallePedido detalle = detalleOpt.get();
        detalle.setNombreProducto(evento.getNombreProducto());
        detalle.setPrecioUnitario(evento.getPrecioUnitario());
        detalle.setSubtotal(detalle.getCantidad() * evento.getPrecioUnitario());
        detalleRepo.save(detalle); // Guarda los cambios

        // Verifica si todos los detalles ya tienen precio válido
        boolean incompleto = detalles.stream()
                .anyMatch(d -> d.getPrecioUnitario() == null || d.getPrecioUnitario() == 0.0);

        if (!incompleto) {
            // Si todos tienen precios, calcula el total del pedido
            double total = detalles.stream().mapToDouble(DetallePedido::getSubtotal).sum();

            Pedido pedido = pedidoRepo.findById(evento.getIdPedido()).orElse(null);
            if (pedido != null) {
                pedido.setTotal(total);

                // Avanza el estado del pedido (por ejemplo, de "Recibido" a "Procesando")
                EstadoPedidoState estado = EstadoFactory.getEstado(pedido);
                estado.avanzar(pedido);

                pedidoRepo.save(pedido);
                System.out.println("✅ Total actualizado y estado avanzado.");
            }
        }
    }
}
