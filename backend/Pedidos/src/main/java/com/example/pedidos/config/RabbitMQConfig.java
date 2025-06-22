package com.example.pedidos.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String PEDIDO_EXCHANGE = "pedido.exchange";
    public static final String PEDIDO_CREATED_QUEUE = "pedido.created.queue";
    public static final String PEDIDO_CREATED_ROUTING_KEY = "pedido.created";

    public static final String PEDIDO_QUEUE_RELEASE = "pedido.release.queue";
    public static final String PEDIDO_ROUTING_RELEASE = "pedido.release";

    public static final String PEDIDO_RECALCULO_QUEUE = "pedido.recalculo.queue";
    public static final String PEDIDO_RECALCULO_ROUTING_KEY = "pedido.recalcular_total";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(PEDIDO_EXCHANGE);
    }

    @Bean
    public Queue queueCreated() {
        return new Queue(PEDIDO_CREATED_QUEUE, false);
    }

    @Bean
    public Binding bindingCreated(Queue queueCreated, TopicExchange exchange) {
        return BindingBuilder.bind(queueCreated)
                .to(exchange)
                .with(PEDIDO_CREATED_ROUTING_KEY);
    }

    @Bean
    public Queue queueRelease() {
        return new Queue(PEDIDO_QUEUE_RELEASE, false);
    }

    @Bean
    public Binding bindingRelease(Queue queueRelease, TopicExchange exchange) {
        return BindingBuilder.bind(queueRelease)
                .to(exchange)
                .with(PEDIDO_ROUTING_RELEASE);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }

    @Bean
    public Queue pedidoRecalculoQueue() {
        return new Queue(PEDIDO_RECALCULO_QUEUE, false);
    }

    @Bean
    public Binding bindingPedidoRecalculo(Queue pedidoRecalculoQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(pedidoRecalculoQueue)
                .to(exchange)
                .with(PEDIDO_RECALCULO_ROUTING_KEY);
    }
}