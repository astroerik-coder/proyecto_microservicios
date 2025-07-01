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

    // Nombre de la cola donde este servicio escucha eventos de productos listos
    // para pagar
    public static final String QUEUE_LISTO_PARA_PAGAR = "pedido.listo_para_pagar.queue";
    public static final String ROUTING_LISTO_PARA_PAGAR = "pedido.listo_para_pagar";
    // Nombre de la cola donde este servicio escucha eventos de pago exitoso
    public static final String QUEUE_PAGO_EXITOSO = "pago.exitoso.queue";
    public static final String ROUTING_PAGO_EXITOSO = "pago.exitoso";

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

        DefaultClassMapper classMapper = new DefaultClassMapper();
        Map<String, Class<?>> idClassMapping = new HashMap<>();

        idClassMapping.put(
                "com.example.inventario.models.dto.ProductoInfoEvent",
                com.example.pedidos.models.dto.ProductoInfoEvent.class);

        // ✅ CORRECTO: mapeo cruzado entre paquete del productor y clase del consumidor
        idClassMapping.put(
                "com.example.despachos.models.dto.PedidoListoParaPagarEvent",
                com.example.pedidos.models.dto.PedidoListoParaPagarEvent.class);

        idClassMapping.put(
                "com.example.despachos.models.dto.PagoExitosoEvent",
                com.example.pedidos.models.dto.PagoExitosoEvent.class); // 👈 Este es el importante
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

    /**
     * Cola donde este microservicio escucha eventos de pedidos listos para pagar.
     * Se usa para avanzar el estado del pedido a "Listo para envío".
     */
    @Bean
    public Queue queuePedidoListoParaPagar() {
        return new Queue(QUEUE_LISTO_PARA_PAGAR, false);
    }

    @Bean
    public Binding bindingPedidoListoParaPagar(Queue queuePedidoListoParaPagar, TopicExchange exchange) {
        return BindingBuilder.bind(queuePedidoListoParaPagar)
                .to(exchange)
                .with(ROUTING_LISTO_PARA_PAGAR);
    }

    /**
     * Cola donde este microservicio escucha eventos de pago exitoso.
     * Se usa para avanzar el estado del pedido a "Enviado".
     */
    @Bean
    public Queue queuePagoExitoso() {
        return new Queue(QUEUE_PAGO_EXITOSO, false);
    }

    @Bean
    public Binding bindingPagoExitoso(Queue queuePagoExitoso, TopicExchange exchange) {
        return BindingBuilder.bind(queuePagoExitoso)
                .to(exchange)
                .with(ROUTING_PAGO_EXITOSO);
    }
}
