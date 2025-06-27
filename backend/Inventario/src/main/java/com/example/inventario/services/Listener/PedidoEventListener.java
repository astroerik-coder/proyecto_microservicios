package com.example.inventario.services.Listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventario.config.RabbitMQConfig;
import com.example.inventario.models.dto.ProductoConsultaEvent;
import com.example.inventario.services.ProductoService;
import com.example.inventario.services.Publisher.ProductoInfoPublisher;

/**
 * Listener de eventos RabbitMQ que responde a solicitudes de información de productos
 * provenientes del microservicio de pedidos.
 *
 * Este servicio escucha la cola "producto.consultar.queue" y, al recibir una solicitud,
 * consulta el producto en la base de datos local y responde con los datos necesarios
 * (nombre y precio).
 *
 * Si el producto no existe, puede ser manejado como error o derivado a MuleSoft.
 */
@Service
public class PedidoEventListener {

    private final ProductoService productoService;
    private final ProductoInfoPublisher publisher;

    @Autowired
    public PedidoEventListener(ProductoService productoService, ProductoInfoPublisher publisher) {
        this.productoService = productoService;
        this.publisher = publisher;
    }

    /**
     * Escucha la cola "producto.consultar.queue" y procesa solicitudes de producto.
     * Estas solicitudes son enviadas desde el microservicio de pedidos justo después
     * de crear un pedido que necesita completar detalles.
     *
     * @param evento Evento recibido con los campos:
     *               - idPedido (para correlacionar)
     *               - idProducto (para buscar el producto en inventario)
     *               - cantidad (usado por lógica de stock, si aplica)
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE_PRODUCTO_CONSULTAR)
    public void handleProductoConsulta(ProductoConsultaEvent evento) {
        System.out.println("📥 Recibido producto.consultar para idProducto: " + evento.getIdProducto());

        // Buscar el producto en la base de datos de inventario
        productoService.obtenerProductoPorId(evento.getIdProducto())
            .ifPresentOrElse(producto -> {
                // Si se encuentra, publicar evento producto.info con nombre y precio
                publisher.publicarInfoProducto(
                    evento.getIdPedido(),
                    producto.getId(),
                    producto.getNombre(),
                    producto.getPrecio()
                );
            }, () -> {
                // Si no se encuentra, loguear advertencia (o activar MuleSoft si aplica)
                System.out.println("⚠️ Producto no encontrado: " + evento.getIdProducto());
                // MuleSoft podría intervenir aquí si se desea una orquestación de excepciones
            });
    }
}
