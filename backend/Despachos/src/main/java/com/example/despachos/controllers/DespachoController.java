package com.example.despachos.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.despachos.models.Despacho;
import com.example.despachos.services.DespachoService;

@RestController
@RequestMapping("/api/despachos")
public class DespachoController {

    @Autowired
    private DespachoService despachoService;

    @GetMapping
    public List<Despacho> listar() {
        return despachoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        return despachoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pedido/{idPedido}")
    public List<Despacho> obtenerPorPedido(@PathVariable Long idPedido) {
        return despachoService.listarPorPedido(idPedido);
    }

    @PostMapping
    public ResponseEntity<Despacho> crear(@RequestBody Despacho despacho) {
        return ResponseEntity.ok(despachoService.crear(despacho));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return despachoService.eliminar(id)
                ? ResponseEntity.ok("🚫 Despacho eliminado.")
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/avanzar")
    public ResponseEntity<?> avanzar(@PathVariable Long id) {
        return despachoService.avanzarEstado(id)
                .map(d -> ResponseEntity.ok("✅ Despacho actualizado."))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/fallar")
    public ResponseEntity<?> fallar(@PathVariable Long id) {
        return despachoService.fallarDespacho(id)
                .map(d -> ResponseEntity.ok("❌ Despacho fallido."))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reiniciar")
    public ResponseEntity<?> reiniciar(@PathVariable Long id) {
        return despachoService.reiniciarDespacho(id)
                .map(d -> ResponseEntity.ok("🔁 Despacho reiniciado a estado PENDIENTE."))
                .orElse(ResponseEntity.status(409).body("⚠️ No se pudo reiniciar."));
    }

}