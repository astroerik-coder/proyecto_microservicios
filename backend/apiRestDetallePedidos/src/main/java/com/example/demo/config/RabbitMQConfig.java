package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;

@Configuration
public class RabbitMQConfig {

    public static final String PEDIDO_EXCHANGE = "pedido.exchange";
    public static final String PEDIDO_CREATED_QUEUE = "detalle.pedido.created.queue";
    public static final String PEDIDO_CREATED_ROUTING_KEY = "pedido.created";

    public static final String PRODUCTO_CONSULTA_ROUTING_KEY = "producto.consultar";

    public static final String QUEUE_PRODUCTO_INFO = "producto.info.queue";
    public static final String ROUTING_PRODUCTO_INFO = "producto.info";

    public static final String ROUTING_RECALCULAR_PEDIDO = "pedido.recalcular_total";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(PEDIDO_EXCHANGE);
    }

    @Bean
    public Queue pedidoCreatedQueue() {
        return new Queue(PEDIDO_CREATED_QUEUE, false);
    }

    @Bean
    public Binding pedidoCreatedBinding(Queue pedidoCreatedQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(pedidoCreatedQueue)
                .to(exchange)
                .with(PEDIDO_CREATED_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate tpl = new RabbitTemplate(connectionFactory);
        tpl.setMessageConverter(jsonMessageConverter());
        return tpl;
    }

    @Bean
    public Queue queueProductoInfo() {
        return new Queue(QUEUE_PRODUCTO_INFO, false);
    }

    @Bean
    public Binding bindingProductoInfo(Queue queueProductoInfo, TopicExchange exchange) {
        return BindingBuilder
                .bind(queueProductoInfo)
                .to(exchange)
                .with(ROUTING_PRODUCTO_INFO);
    }
}
