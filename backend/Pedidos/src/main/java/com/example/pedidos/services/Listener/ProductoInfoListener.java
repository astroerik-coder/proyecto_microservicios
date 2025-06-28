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
import com.example.pedidos.models.dto.PedidoListoParaPagarEvent;
import com.example.pedidos.repositories.DetallePedidoRepository;
import com.example.pedidos.repositories.PedidoRepository;
import com.example.pedidos.state.EstadoFactory;
import com.example.pedidos.state.EstadoPedidoState;

/**
 * Listener que se activa cuando llega un mensaje de tipo "producto.info"
 * desde el microservicio de inventario,
 * o cuando se recibe un evento "pedido.listo_para_pagar" desde el micro de
 * despachos.
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

        List<DetallePedido> detalles = detalleRepo.findByPedidoIdAndEliminadoFalse(evento.getIdPedido());

        Optional<DetallePedido> detalleOpt = detalles.stream()
                .filter(d -> d.getIdProducto().equals(evento.getIdProducto()))
                .findFirst();

        if (detalleOpt.isEmpty()) {
            System.out.println("⚠️ Detalle no encontrado.");
            return;
        }

        DetallePedido detalle = detalleOpt.get();
        detalle.setNombreProducto(evento.getNombreProducto());
        detalle.setPrecioUnitario(evento.getPrecioUnitario());
        detalle.setSubtotal(detalle.getCantidad() * evento.getPrecioUnitario());
        detalleRepo.save(detalle);

        boolean incompleto = detalles.stream()
                .anyMatch(d -> d.getPrecioUnitario() == null || d.getPrecioUnitario() == 0.0);

        if (!incompleto) {
            Pedido pedido = pedidoRepo.findById(evento.getIdPedido()).orElse(null);
            if (pedido != null) {
                pedido.setTotal(detalles.stream().mapToDouble(DetallePedido::getSubtotal).sum());

                if ("Recibido".equalsIgnoreCase(pedido.getEstado())) {
                    EstadoPedidoState estado = EstadoFactory.getEstado(pedido);
                    estado.avanzar(pedido); // De "Recibido" → "Procesando"
                    pedido.setEstado("Listo para despachar"); // Forzamos este estado
                    System.out.println("✅ Estado cambiado a 'Listo para despachar'");
                } else {
                    System.out.println("ℹ️ No se avanzó el estado. Estado actual: " + pedido.getEstado());
                }

                pedidoRepo.save(pedido);
            }
        }
    }

      
}
