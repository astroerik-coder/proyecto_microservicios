package com.example.inventario.services;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventario.config.RabbitMQConfig;
import com.example.inventario.models.dto.ProductoConsultaEvent;
import com.example.inventario.services.ProductoService;
@Service
public class PedidoEventListener {

    private final ProductoService productoService;
    private final ProductoInfoPublisher publisher;

    @Autowired
    public PedidoEventListener(ProductoService productoService, ProductoInfoPublisher publisher) {
        this.productoService = productoService;
        this.publisher = publisher;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PRODUCTO_CONSULTAR)
    public void handleProductoConsulta(ProductoConsultaEvent evento) {
        System.out.println("📥 Recibido producto.consultar para idProducto: " + evento.getIdProducto());

        productoService.obtenerProductoPorId(evento.getIdProducto())
            .ifPresentOrElse(producto -> {
                publisher.publicarInfoProducto(
                    evento.getIdPedido(),
                    producto.getId(),
                    producto.getNombre(),
                    producto.getPrecio()
                );
            }, () -> {
                System.out.println("⚠️ Producto no encontrado: " + evento.getIdProducto());
                // Aquí podrías publicar un evento de error o dejar que MuleSoft intervenga.
            });
    }
}


