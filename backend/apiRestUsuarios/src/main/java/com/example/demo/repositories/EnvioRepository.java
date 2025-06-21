package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Envio;

public interface EnvioRepository extends JpaRepository<Envio, Long> {

    List<Envio> findByEliminadoFalse();

List<Envio> findByIdDespachoAndEliminadoFalse(Long idDespacho);
}
