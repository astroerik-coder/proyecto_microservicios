package com.example.pedidos.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de RabbitMQ para el microservicio de pedidos.
 * Esta clase define las colas, exchange, bindings y conversores de mensajes
 * necesarios para la interacción con el microservicio de inventario.
 */
@Configuration
public class RabbitMQConfig {

    // Nombre del exchange que conecta todos los eventos del sistema
    public static final String EXCHANGE_PEDIDO = "pedido.exchange";

    // Routing key utilizada para enviar solicitudes de datos de productos
    public static final String ROUTING_PRODUCTO_CONSULTA = "producto.consultar";

    // Nombre de la cola donde este servicio recibe información de producto desde
    // inventario
    public static final String QUEUE_PRODUCTO_INFO = "producto.info.queue";

    // Routing key que usa inventario para responder con nombre y precio de un
    // producto
    public static final String ROUTING_PRODUCTO_INFO = "producto.info";

    // Routing key utilizada para solicitar disminución de stock en inventario
    public static final String ROUTING_STOCK_DISMINUIR = "stock.disminuir";

    /**
     * Crea un exchange tipo "topic" para publicar y suscribirse a eventos.
     */
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_PEDIDO);
    }

    /**
     * Crea la cola donde este microservicio escuchará eventos con información de
     * productos.
     */
    @Bean
    public Queue queueProductoInfo() {
        return new Queue(QUEUE_PRODUCTO_INFO, false); // no durable (se borra al reiniciar)
    }

    /**
     * Define la relación (binding) entre el exchange y la cola
     * usando la routing key "producto.info".
     */
    @Bean
    public Binding bindingProductoInfo(Queue queueProductoInfo, TopicExchange exchange) {
        return BindingBuilder.bind(queueProductoInfo)
                .to(exchange)
                .with(ROUTING_PRODUCTO_INFO);
    }

    /**
     * Conversor de mensajes JSON que mapea tipos remotos a clases locales.
     * Esto permite que los mensajes recibidos desde otros microservicios
     * con diferentes paquetes se puedan deserializar correctamente.
     */
    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();

        // Clase responsable de traducir el __TypeId__ del mensaje a una clase local
        DefaultClassMapper classMapper = new DefaultClassMapper();
        Map<String, Class<?>> idClassMapping = new HashMap<>();

        // Mapeo explícito: el productor envía ProductoInfoEvent con este paquete...
        idClassMapping.put(
                "com.example.inventario.models.dto.ProductoInfoEvent",
                com.example.pedidos.models.dto.ProductoInfoEvent.class // ...y lo interpretamos con esta clase local
        );

        classMapper.setIdClassMapping(idClassMapping);
        converter.setClassMapper(classMapper);

        return converter;
    }

    /**
     * Bean de RabbitTemplate con el conversor JSON configurado,
     * utilizado para publicar eventos hacia otros microservicios.
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory factory) {
        RabbitTemplate template = new RabbitTemplate(factory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
