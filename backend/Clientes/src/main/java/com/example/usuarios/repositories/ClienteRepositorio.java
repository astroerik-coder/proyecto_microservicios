package com.example.usuarios.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.usuarios.models.Cliente;

@Repository
public interface ClienteRepositorio extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByNombreUsuario(String nombreUsuario);
    Optional<Cliente> findByCorreo(String correo);

    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByCorreo(String correo);
}
