package com.example.pedidos.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.repositories.PedidoRepository;
import com.example.pedidos.state.EstadoFactory;
import com.example.pedidos.state.EstadoPedidoState;
import com.example.pedidos.state.estados.EstadoRecibido;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private PedidoEventPublisher publisher;

    // Listar todos los pedidos activos
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findByEliminadoFalse();
    }

    // Obtener pedido por ID
    public Optional<Pedido> obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id)
                .filter(p -> !p.getEliminado());
    }

    // Crear nuevo pedido
    public Pedido crearPedido(Pedido pedido) {
        pedido.setEstado(new EstadoRecibido().nombreEstado());
        Pedido nuevo = pedidoRepository.save(pedido);
        publisher.publicarPedidoCreado(nuevo);
        return nuevo;
    }

    @Transactional
    public Optional<Pedido> actualizarEstado(Long id, String nuevoEstado) {
        return pedidoRepository.findById(id)
                .filter(p -> !p.getEliminado())
                .map(p -> {
                    p.setEstado(nuevoEstado);
                    Pedido actualizado = pedidoRepository.save(p);
                    if ("Cancelado".equalsIgnoreCase(nuevoEstado)) {
                        publisher.publishRelease(actualizado);
                    }
                    return actualizado;
                });
    }

    // Cambiar estado del pedido a siguiente (usar patrón State)
    public Optional<Pedido> avanzarEstado(Long id) {
        Optional<Pedido> optional = obtenerPedidoPorId(id);
        if (optional.isPresent()) {
            Pedido pedido = optional.get();
            EstadoPedidoState estadoActual = EstadoFactory.getEstado(pedido);
            estadoActual.avanzar(pedido);
            return Optional.of(pedidoRepository.save(pedido));
        }
        return Optional.empty();
    }

    // Cancelar un pedido
    public Optional<Pedido> cancelarPedido(Long id) {
        Optional<Pedido> optional = obtenerPedidoPorId(id);
        if (optional.isPresent()) {
            Pedido pedido = optional.get();
            EstadoPedidoState estadoActual = EstadoFactory.getEstado(pedido);
            estadoActual.cancelar(pedido);
            return Optional.of(pedidoRepository.save(pedido));
        }
        return Optional.empty();
    }

    // Eliminar lógicamente un pedido
    public boolean eliminarPedido(Long id) {
        Optional<Pedido> optional = obtenerPedidoPorId(id);
        if (optional.isPresent()) {
            Pedido pedido = optional.get();
            pedido.setEliminado(true);
            pedidoRepository.save(pedido);
            return true;
        }
        return false;
    }
}