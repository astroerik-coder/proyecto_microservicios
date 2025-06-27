package com.example.inventario.services;

import com.example.inventario.config.RabbitMQConfig;
import com.example.inventario.models.Producto;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class ProductoActualizadoPublisher {

    private final RabbitTemplate rabbitTemplate;

    public ProductoActualizadoPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicarProductoActualizado(Producto producto) {
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,
            "producto.actualizado",
            producto
        );
        System.out.println("📤 Evento producto.actualizado enviado para producto ID: " + producto.getId());
    }
}
