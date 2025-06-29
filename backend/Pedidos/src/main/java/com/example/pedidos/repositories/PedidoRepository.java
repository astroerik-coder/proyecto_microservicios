package com.example.pedidos.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.pedidos.models.Pedido;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Listar pedidos no eliminados
    List<Pedido> findByEliminadoFalse();

    // Buscar pedidos por cliente
    List<Pedido> findByIdClienteAndEliminadoFalse(Long idCliente);

    // Filtrar por estado
    List<Pedido> findByEstadoAndEliminadoFalse(String estado);

    Page<Pedido> findByEliminadoFalse(Pageable pageable);

    Page<Pedido> findByIdClienteAndEliminadoFalse(Long clienteId, Pageable pageable);
}