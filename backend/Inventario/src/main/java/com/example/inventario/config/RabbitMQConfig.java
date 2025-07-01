package com.example.inventario.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;

/**
 * Configuración de RabbitMQ para el microservicio de inventario.
 * Define las colas y bindings que este servicio utiliza para:
 * - Escuchar solicitudes de productos desde pedidos
 * - Publicar respuestas con nombre y precio de productos
 * 
 * También configura el conversor JSON necesario para serializar/deserializar
 * eventos.
 */
@Configuration
public class RabbitMQConfig {

    // Exchange principal que conecta todos los servicios por eventos
    public static final String EXCHANGE = "pedido.exchange";

    // Cola principal que escucha solicitudes de productos desde pedidos
    public static final String QUEUE_PRODUCTO_CONSULTAR = "producto.consultar.queue";
    public static final String ROUTING_PRODUCTO_CONSULTAR = "producto.consultar";
    // Cola para disminuir stock de productos
    public static final String QUEUE_STOCK_DISMINUIR = "stock.disminuir.queue";
    public static final String ROUTING_STOCK_DISMINUIR = "stock.disminuir";

    /**
     * Define el exchange de tipo "topic" para el sistema.
     */
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    /**
     * Conversor de mensajes JSON para enviar y recibir eventos como objetos Java.
     */
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();

        // Configurar los paquetes de confianza para deserialización segura
        DefaultClassMapper classMapper = new DefaultClassMapper();
        classMapper.setTrustedPackages("*"); // Confiar en todos los paquetes

        return converter;
    }

    /**
     * Configura el contenedor que maneja los listeners de Rabbit,
     * aplicando el conversor JSON para deserializar automáticamente los eventos.
     */
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory cf, Jackson2JsonMessageConverter conv) {
        SimpleRabbitListenerContainerFactory f = new SimpleRabbitListenerContainerFactory();
        f.setConnectionFactory(cf);
        f.setMessageConverter(conv);
        return f;
    }

    /**
     * Cola que escucha las solicitudes de datos de productos desde pedidos.
     */
    @Bean
    public Queue queueProductoConsulta() {
        return new Queue(QUEUE_PRODUCTO_CONSULTAR, false);
    }

    @Bean
    public Binding bindingProductoConsulta(Queue queueProductoConsulta, TopicExchange exchange) {
        return BindingBuilder
                .bind(queueProductoConsulta)
                .to(exchange)
                .with(ROUTING_PRODUCTO_CONSULTAR);
    }

    /**
     * Cola que escucha las solicitudes de disminución de stock por despacho.
     * Esta cola es utilizada por el microservicio de pedidos para notificar
     * al inventario que se debe disminuir el stock de un producto.
     */
    @Bean
    public Queue queueStockDisminuir() {
        return new Queue(QUEUE_STOCK_DISMINUIR, false);
    }

    @Bean
    public Binding bindingStockDisminuir(Queue queueStockDisminuir, TopicExchange exchange) {
        return BindingBuilder
                .bind(queueStockDisminuir)
                .to(exchange)
                .with(ROUTING_STOCK_DISMINUIR);
    }

}
