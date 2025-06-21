package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Cobro;
import com.example.demo.repositories.CobroRepository;
import com.state.CobroContext;

@Service
public class CobroService {

    @Autowired
    private CobroRepository cobroRepository;

    // ✅ Listar cobros activos
    public List<Cobro> listarTodos() {
        return cobroRepository.findByEliminadoFalse();
    }

    // ✅ Obtener por ID
    public Optional<Cobro> obtenerPorId(Long id) {
        return cobroRepository.findById(id)
                .filter(cobro -> !cobro.getEliminado());
    }

    // ✅ Obtener todos los cobros de un pedido
    public List<Cobro> listarPorPedido(Long idPedido) {
        return cobroRepository.findByIdPedidoAndEliminadoFalse(idPedido);
    }

    // ✅ Crear nuevo cobro
    public Cobro crearCobro(Cobro cobro) {
        return cobroRepository.save(cobro);
    }

    // ✅ Eliminar lógicamente
    public boolean eliminarCobro(Long id) {
        Optional<Cobro> opcional = obtenerPorId(id);
        if (opcional.isPresent()) {
            Cobro cobro = opcional.get();
            cobro.setEliminado(true);
            cobroRepository.save(cobro);
            return true;
        }
        return false;
    }

    // ✅ Procesar pago (transición de estado)
    public Optional<Cobro> procesarPago(Long id) {
        Optional<Cobro> optional = obtenerPorId(id);
        if (optional.isPresent()) {
            Cobro cobro = optional.get();
            CobroContext context = new CobroContext(cobro);
            context.procesarPago(cobro);
            return Optional.of(cobroRepository.save(cobro));
        }
        return Optional.empty();
    }

    // ✅ Marcar como fallido
    public Optional<Cobro> marcarFallido(Long id) {
        Optional<Cobro> optional = obtenerPorId(id);
        if (optional.isPresent()) {
            Cobro cobro = optional.get();
            CobroContext context = new CobroContext(cobro);
            context.marcarFallido(cobro);
            return Optional.of(cobroRepository.save(cobro));
        }
        return Optional.empty();
    }

    // ✅ Reintentar cobro
    public Optional<Cobro> reintentarCobro(Long id) {
        Optional<Cobro> optional = obtenerPorId(id);
        if (optional.isPresent()) {
            Cobro cobro = optional.get();
            CobroContext context = new CobroContext(cobro);
            context.reintentar(cobro);
            return Optional.of(cobroRepository.save(cobro));
        }
        return Optional.empty();
    }
}