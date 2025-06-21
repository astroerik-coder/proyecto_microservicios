package com.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;

import com.example.demo.config.RabbitMQConfig;
import com.example.demo.models.dto.PedidoDTO;
import com.example.demo.services.ProductoService;

public class PedidoEventListener {
    private final ProductoService productoService;

    public PedidoEventListener(ProductoService productoService) {
        this.productoService = productoService;
    }

    @RabbitListener(queues = RabbitMQConfig.PEDIDO_CREADO_QUEUE)
    public void manejarPedidoCreado(PedidoDTO pedido) {
        System.out.println("📩 Pedido recibido por RabbitMQ - ID: " + pedido.getId());

        pedido.getLineas().forEach(linea -> {
            boolean exito = productoService.disminuirStock(linea.getIdProducto(), linea.getCantidad());
            if (exito) {
                System.out.println("✅ Stock disminuido para producto " + linea.getIdProducto());
            } else {
                System.out.println("⚠️ No se pudo disminuir stock para producto " + linea.getIdProducto());
            }
        });
    }

}
