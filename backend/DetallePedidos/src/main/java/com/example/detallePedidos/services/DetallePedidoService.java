package com.example.detallePedidos.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.detallePedidos.models.DetallePedido;
import com.example.detallePedidos.repositories.DetallePedidoRepository;

@Service
public class DetallePedidoService {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    // ✅ Listar todos los detalles activos
    public List<DetallePedido> listarDetalles() {
        return detallePedidoRepository.findByEliminadoFalse();
    }

    // ✅ Obtener detalle por ID
    public Optional<DetallePedido> obtenerPorId(Long id) {
        return detallePedidoRepository.findById(id)
                .filter(det -> !det.getEliminado());
    }

    // ✅ Listar detalles de un pedido específico
    public List<DetallePedido> listarPorPedido(Long idPedido) {
        return detallePedidoRepository.findByIdPedidoAndEliminadoFalse(idPedido);
    }

    // ✅ Crear un nuevo detalle de pedido
    public DetallePedido crearDetalle(DetallePedido detalle) {
        // Calculamos el subtotal automáticamente
        double subtotal = detalle.getCantidad() * detalle.getPrecioUnitario();
        detalle.setSubtotal(subtotal);
        return detallePedidoRepository.save(detalle);
    }

    // ✅ Actualizar detalle
    public Optional<DetallePedido> actualizarDetalle(Long id, DetallePedido actualizado) {
        Optional<DetallePedido> optional = obtenerPorId(id);
        if (optional.isPresent()) {
            DetallePedido existente = optional.get();
            existente.setCantidad(actualizado.getCantidad());
            existente.setPrecioUnitario(actualizado.getPrecioUnitario());
            existente.setNombreProducto(actualizado.getNombreProducto());
            existente.setIdProducto(actualizado.getIdProducto());

            // Recalcular subtotal
            double subtotal = actualizado.getCantidad() * actualizado.getPrecioUnitario();
            existente.setSubtotal(subtotal);

            return Optional.of(detallePedidoRepository.save(existente));
        }
        return Optional.empty();
    }

    // ✅ Eliminar lógicamente
    public boolean eliminarDetalle(Long id) {
        Optional<DetallePedido> optional = obtenerPorId(id);
        if (optional.isPresent()) {
            DetallePedido detalle = optional.get();
            detalle.setEliminado(true);
            detallePedidoRepository.save(detalle);
            return true;
        }
        return false;
    }
}
