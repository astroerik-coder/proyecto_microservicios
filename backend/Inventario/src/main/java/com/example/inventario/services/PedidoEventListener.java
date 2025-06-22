package com.example.inventario.services;

import org.springframework.amqp.rabbit.annotation.RabbitListener;

import com.example.inventario.config.RabbitMQConfig;
import com.example.inventario.models.dto.PedidoDTO;
import com.example.inventario.models.dto.LineaPedidoDTO;
import com.example.inventario.services.ProductoService;

public class PedidoEventListener {
    private final ProductoService productoService;

    public PedidoEventListener(ProductoService productoService) {
        this.productoService = productoService;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_CREATED, containerFactory = "rabbitListenerContainerFactory")
    public void onPedidoCreated(PedidoDTO evt) {
        evt.getLineas().forEach(linea -> {
            productoService.disminuirStock(linea.getIdProducto(), linea.getCantidad());
            System.out.printf("Stock ↓ producto %d en %d unidades%n",
                    linea.getIdProducto(), linea.getCantidad());
        });
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_RELEASE, containerFactory = "rabbitListenerContainerFactory")
    public void onPedidoCancelled(PedidoDTO evt) {
        evt.getLineas().forEach(linea -> {
            productoService.liberarStock(linea.getIdProducto(), linea.getCantidad());
            System.out.printf("Stock ↑ producto %d en %d unidades%n",
                    linea.getIdProducto(), linea.getCantidad());
        });
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_CREATED)
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
