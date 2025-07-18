package com.example.despachos.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.despachos.models.Despacho;

@Repository
public interface DespachoRepository extends JpaRepository<Despacho, Long> {

    List<Despacho> findByEliminadoFalse();

    List<Despacho> findByIdPedidoAndEliminadoFalse(Long idPedido);
}