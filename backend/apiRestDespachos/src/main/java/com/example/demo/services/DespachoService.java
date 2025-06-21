package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Despacho;
import com.example.demo.models.EstadoDespacho;
import com.example.demo.repositories.DespachoRepository;
import com.state.DespachoContext;

@Service
public class DespachoService {

    @Autowired
    private DespachoRepository despachoRepository;

    public List<Despacho> listarTodos() {
        return despachoRepository.findByEliminadoFalse();
    }

    public Optional<Despacho> obtenerPorId(Long id) {
        return despachoRepository.findById(id)
                .filter(d -> !d.getEliminado());
    }

    public List<Despacho> listarPorPedido(Long idPedido) {
        return despachoRepository.findByIdPedidoAndEliminadoFalse(idPedido);
    }

    public Despacho crear(Despacho despacho) {
        return despachoRepository.save(despacho);
    }

    public boolean eliminar(Long id) {
        Optional<Despacho> optional = obtenerPorId(id);
        if (optional.isPresent()) {
            Despacho despacho = optional.get();
            despacho.setEliminado(true);
            despachoRepository.save(despacho);
            return true;
        }
        return false;
    }

    public Optional<Despacho> avanzarEstado(Long id) {
        return obtenerPorId(id).flatMap(despacho -> {
            DespachoContext ctx = new DespachoContext(despacho);
            boolean exito = ctx.avanzar(despacho);
            if (!exito)
                return Optional.empty();
            despachoRepository.save(despacho);
            return Optional.of(despacho);
        });
    }

    public Optional<Despacho> fallarDespacho(Long id) {
        return obtenerPorId(id).flatMap(despacho -> {
            DespachoContext context = new DespachoContext(despacho);
            boolean exito = context.fallar(despacho);

            if (!exito)
                return Optional.empty();

            despachoRepository.save(despacho);
            return Optional.of(despacho);
        });
    }

    public Optional<Despacho> reiniciarDespacho(Long id) {
        return obtenerPorId(id).flatMap(despacho -> {
            despacho.setEstado(EstadoDespacho.PENDIENTE);
            despachoRepository.save(despacho);
            return Optional.of(despacho);
        });
    }
}
