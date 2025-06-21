package com.example.demo.config;



import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;

public class RabbitMQConfig {
    // Cola que escuchará este microservicio
    public static final String PEDIDO_CREADO_QUEUE = "pedido.created.queue";

    @Bean
    public Queue pedidoCreatedQueue() {
        return new Queue(PEDIDO_CREADO_QUEUE, false);
    }
}
