package com.example.inventario.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "pedido.exchange";

    public static final String QUEUE_CREATED = "pedido.created.queue";
    public static final String ROUTING_CREATED = "pedido.created";

    public static final String QUEUE_RELEASE = "pedido.release.queue";
    public static final String ROUTING_RELEASE = "pedido.release";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue queueCreated() {
        return new Queue(QUEUE_CREATED, false);
    }

    @Bean
    public Binding bindingCreated(Queue queueCreated, TopicExchange exchange) {
        return BindingBuilder.bind(queueCreated)
                .to(exchange)
                .with(ROUTING_CREATED);
    }

    @Bean
    public Queue queueRelease() {
        return new Queue(QUEUE_RELEASE, false);
    }

    @Bean
    public Binding bindingRelease(Queue queueRelease, TopicExchange exchange) {
        return BindingBuilder
                .bind(queueRelease)
                .to(exchange)
                .with(ROUTING_RELEASE);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory cf, Jackson2JsonMessageConverter conv) {
        SimpleRabbitListenerContainerFactory f = new SimpleRabbitListenerContainerFactory();
        f.setConnectionFactory(cf);
        f.setMessageConverter(conv);
        return f;
    }
}
