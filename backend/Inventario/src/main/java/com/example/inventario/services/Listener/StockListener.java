package com.example.inventario.services.Listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.example.inventario.config.RabbitMQConfig;
import com.example.inventario.models.dto.ProductoConsultaEvent;
import com.example.inventario.services.ProductoService;

/**
 * Listener que escucha eventos de tipo "stock.disminuir"
 * y ejecuta la lógica para disminuir stock en el inventario.
 */
@Service
public class StockListener {

    private final ProductoService productoService;

    public StockListener(ProductoService productoService) {
        this.productoService = productoService;
    }

    /**
     * Procesa el evento recibido con idProducto y cantidad.
     * Disminuye el stock del producto si existe.
     *
     * @param evento Evento con idProducto y cantidad a restar.
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE_STOCK_DISMINUIR)
    public void handleStockDisminuir(ProductoConsultaEvent evento) {
        System.out.println("📥 stock.disminuir recibido para producto " + evento.getIdProducto());

        boolean resultado = productoService.disminuirStock(
            evento.getIdProducto(),
            evento.getCantidad()
        );

        if (resultado) {
            System.out.println("✅ Stock actualizado correctamente.");
        } else {
            System.out.println("❌ No se pudo disminuir el stock (producto no encontrado o insuficiente).");
        }
    }
}