package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Envio;
import com.example.demo.models.EstadoEnvio;
import com.example.demo.repositories.EnvioRepository;
import com.state.EnvioContext;
@Service

public class EnvioService {
 @Autowired
private EnvioRepository envioRepository;

// ✅ Listar todos los envíos no eliminados
public List<Envio> listarTodos() {
    return envioRepository.findByEliminadoFalse();
}

// ✅ Obtener por ID
public Optional<Envio> obtenerPorId(Long id) {
    return envioRepository.findById(id)
            .filter(e -> !e.getEliminado());
}


// ✅ Crear nuevo envío
public Envio crear(Envio envio) {
    envio.setEstado(EstadoEnvio.EN_TRANSITO); // Estado inicial
    return envioRepository.save(envio);
}

// ✅ Eliminar lógicamente
public boolean eliminar(Long id) {
    Optional<Envio> opcional = obtenerPorId(id);
    if (opcional.isPresent()) {
        Envio envio = opcional.get();
        envio.setEliminado(true);
        envioRepository.save(envio);
        return true;
    }
    return false;
}

// ✅ Avanzar estado (por ejemplo: EN_TRANSITO → ENTREGADO)
public Optional<Envio> avanzarEstado(Long id) {
    return obtenerPorId(id).flatMap(envio -> {
        EnvioContext ctx = new EnvioContext(envio);
        boolean exito = ctx.avanzar(envio);
        if (!exito) return Optional.empty();
        envioRepository.save(envio);
        return Optional.of(envio);
    });
}

// ✅ Marcar como cancelado (si el estado lo permite)
public Optional<Envio> cancelar(Long id) {
    return obtenerPorId(id).flatMap(envio -> {
        EnvioContext ctx = new EnvioContext(envio);
        boolean exito = ctx.cancelar(envio);
        if (!exito) return Optional.empty();
        envioRepository.save(envio);
        return Optional.of(envio);
    });
}

// ✅ Marcar como devuelto (si aplica)
public Optional<Envio> devolver(Long id) {
    return obtenerPorId(id).flatMap(envio -> {
        EnvioContext ctx = new EnvioContext(envio);
        boolean exito = ctx.devolver(envio);
        if (!exito) return Optional.empty();
        envioRepository.save(envio);
        return Optional.of(envio);
    });
}


}
