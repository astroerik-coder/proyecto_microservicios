package com.example.pedidos.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.pedidos.models.DetallePedido;
import com.example.pedidos.models.Pedido;
import com.example.pedidos.models.dto.CrearPedidoDTO;
import com.example.pedidos.models.dto.LineaPedidoDTO;
import com.example.pedidos.repositories.PedidoRepository;
import com.example.pedidos.state.EstadoFactory;
import com.example.pedidos.state.EstadoPedidoState;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private com.example.pedidos.services.Publisher.ProductoConsultaPublisher productoConsultaPublisher;

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findByEliminadoFalse();
    }

    public Optional<Pedido> obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id).filter(p -> !p.getEliminado());
    }

    @Transactional
    public Pedido crearPedido(CrearPedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setIdCliente(dto.getIdCliente());
        pedido.setEstado("Recibido");

        double total = 0.0;

        for (LineaPedidoDTO linea : dto.getLineas()) {
            DetallePedido detalle = new DetallePedido();
            detalle.setIdProducto(linea.getIdProducto());
            detalle.setNombreProducto(linea.getNombreProducto());
            detalle.setCantidad(linea.getCantidad());
            detalle.setPrecioUnitario(linea.getPrecioUnitario());

            double subtotal = linea.getCantidad() * linea.getPrecioUnitario();
            detalle.setSubtotal(subtotal);

            total += subtotal;

            pedido.agregarDetalle(detalle);
        }

        pedido.setTotal(total);

        Pedido nuevo = pedidoRepository.save(pedido); // guarda pedido y detalles por cascada

        // ✅ Publicar eventos a RabbitMQ
        for (DetallePedido detalle : nuevo.getDetalles()) {
            productoConsultaPublisher.publicarSolicitud(
                    nuevo.getId(),
                    detalle.getIdProducto(),
                    detalle.getCantidad());

            productoConsultaPublisher.publicarDisminucionStock(
                    detalle.getIdProducto(),
                    detalle.getCantidad());
        }

        return nuevo;
    }

    @Transactional
    public Optional<Pedido> actualizarEstado(Long id, String nuevoEstado) {
        return pedidoRepository.findById(id)
                .filter(p -> !p.getEliminado())
                .map(p -> {
                    p.setEstado(nuevoEstado);
                    return pedidoRepository.save(p);
                });
    }

    public Optional<Pedido> avanzarEstado(Long id) {
        return obtenerPedidoPorId(id)
                .map(pedido -> {
                    EstadoPedidoState estado = EstadoFactory.getEstado(pedido);
                    estado.avanzar(pedido);
                    return pedidoRepository.save(pedido);
                });
    }

    public Optional<Pedido> cancelarPedido(Long id) {
        return obtenerPedidoPorId(id)
                .map(pedido -> {
                    EstadoPedidoState estado = EstadoFactory.getEstado(pedido);
                    estado.cancelar(pedido);
                    return pedidoRepository.save(pedido);
                });
    }

    public boolean eliminarPedido(Long id) {
        return obtenerPedidoPorId(id)
                .map(p -> {
                    p.setEliminado(true);
                    pedidoRepository.save(p);
                    return true;
                })
                .orElse(false);
    }

    public List<Pedido> obtenerPedidosPorCliente(Long clienteId) {
        return pedidoRepository.findByIdClienteAndEliminadoFalse(clienteId);
    }

    public Page<Pedido> listarPedidosPaginados(Pageable pageable) {
        return pedidoRepository.findByEliminadoFalse(pageable);
    }

    public Page<Pedido> obtenerPedidosPorClientePaginados(Long clienteId, Pageable pageable) {
        return pedidoRepository.findByIdClienteAndEliminadoFalse(clienteId, pageable);
    }
}