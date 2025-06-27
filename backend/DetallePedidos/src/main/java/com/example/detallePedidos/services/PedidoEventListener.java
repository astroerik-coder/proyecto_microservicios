package com.example.detallePedidos.services;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.detallePedidos.config.RabbitMQConfig;
import com.example.detallePedidos.models.DetallePedido;
import com.example.detallePedidos.models.dtos.LineaPedidoDTO;
import com.example.detallePedidos.models.dtos.PedidoEventDTO;

@Service
public class PedidoEventListener {

    @Autowired
    private DetallePedidoService detalleService;

    @Autowired
    private ProductoActualizadoPublisher productoPublisher;

    @RabbitListener(queues = RabbitMQConfig.PEDIDO_CREATED_QUEUE)
    public void handlePedidoCreated(PedidoEventDTO evento) {
        System.out.println("📥 Pedido recibido: " + evento.getId());

        if (evento.getLineas() == null || evento.getLineas().isEmpty()) {
            System.out.println("⚠️ No hay líneas en el pedido.");
            return;
        }

        for (LineaPedidoDTO linea : evento.getLineas()) {
            DetallePedido detalle = new DetallePedido();
            detalle.setIdPedido(evento.getId());
            detalle.setIdProducto(linea.getIdProducto());
            detalle.setCantidad(linea.getCantidad());
            detalle.setPrecioUnitario(0.0); // por ahora
            detalle.setSubtotal(0.0);

            detalleService.crearDetalle(detalle);

            // Publicar evento para solicitar datos del producto
            productoPublisher.publicarSolicitudProducto(
                evento.getId(),
                linea.getIdProducto(),
                linea.getCantidad()
            );
        }

        System.out.println("✅ Pedido procesado y productos solicitados.");
    }
}