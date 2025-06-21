package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Pedido;
import com.example.demo.repositories.PedidoRepository;
import com.example.demo.state.EstadoFactory;
import com.example.demo.state.EstadoPedidoState;

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
        pedido.setEstado("Recibido");
        Pedido nuevo = pedidoRepository.save(pedido);
        publisher.publicarPedidoCreado(nuevo);
        return nuevo;
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