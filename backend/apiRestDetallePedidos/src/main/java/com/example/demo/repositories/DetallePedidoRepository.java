package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.DetallePedido;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    // Buscar todos los detalles de un pedido
    List<DetallePedido> findByIdPedidoAndEliminadoFalse(Long idPedido);

    // Buscar todos los detalles activos
    List<DetallePedido> findByEliminadoFalse();

    // Buscar por producto (si se desea listar qué pedidos tienen tal producto)
    List<DetallePedido> findByIdProductoAndEliminadoFalse(Long idProducto);
}
