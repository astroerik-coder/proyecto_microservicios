package com.example.demo.repositories;

import com.example.demo.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    // Para evitar traer los eliminados
    List<Cliente> findByEliminadoFalse();

    // Buscar por nombre sin mostrar eliminados
    List<Cliente> findByNombreContainingAndEliminadoFalse(String nombre);
}
