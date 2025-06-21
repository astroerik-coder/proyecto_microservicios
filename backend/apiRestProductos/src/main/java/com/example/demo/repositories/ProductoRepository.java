package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar todos los productos activos (no eliminados)
    List<Producto> findByEliminadoFalse();

    // Buscar por ID si no está eliminado
    Optional<Producto> findByIdAndEliminadoFalse(Long id);

    // Buscar por nombre (opcional)
    List<Producto> findByNombreContainingIgnoreCaseAndEliminadoFalse(String nombre);
}