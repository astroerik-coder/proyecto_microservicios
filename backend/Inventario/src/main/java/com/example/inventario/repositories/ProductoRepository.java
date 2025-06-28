package com.example.inventario.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.inventario.models.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar todos los productos activos (no eliminados)
    List<Producto> findByEliminadoFalse();

    // Buscar por ID si no está eliminado
    Optional<Producto> findByIdAndEliminadoFalse(Long id);

    //Listar productos paginados
    Page<Producto> findByEliminadoFalse(Pageable pageable);

    // Buscar por nombre (opcional)
    List<Producto> findByNombreContainingIgnoreCaseAndEliminadoFalse(String nombre);
}