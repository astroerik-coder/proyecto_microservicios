package com.example.inventario.services;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventario.config.RabbitMQConfig;
import com.example.inventario.models.dto.ProductoInfoEvent;

@Service
public class ProductoInfoPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publicarInfoProducto(Long idPedido, Long idProducto, String nombre, Double precio) {
        ProductoInfoEvent evento = new ProductoInfoEvent();
        evento.setIdPedido(idPedido);
        evento.setIdProducto(idProducto);
        evento.setNombreProducto(nombre);
        evento.setPrecioUnitario(precio);

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,
            "producto.info", // tú decides este routing key
            evento
        );

        System.out.println("📤 producto.info publicado para producto: " + idProducto);
    }
}