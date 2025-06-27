package com.example.pedidos.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.pedidos.models.DetallePedido;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    List<DetallePedido> findByPedidoIdAndEliminadoFalse(Long idPedido); // ← este es el correcto

    List<DetallePedido> findByEliminadoFalse();

    List<DetallePedido> findByIdProductoAndEliminadoFalse(Long idProducto);
}

