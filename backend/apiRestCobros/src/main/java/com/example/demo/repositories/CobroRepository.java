package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Cobro;

@Repository
public interface CobroRepository extends JpaRepository<Cobro, Long> {

    // Buscar cobros por pedido (no eliminados)
    List<Cobro> findByIdPedidoAndEliminadoFalse(Long idPedido);

    // Buscar todos los cobros activos
    List<Cobro> findByEliminadoFalse();
}