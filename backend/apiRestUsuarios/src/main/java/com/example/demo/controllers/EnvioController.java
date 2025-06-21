package com.example.demo.controllers;

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
import com.example.demo.models.Envio;
import com.example.demo.services.EnvioService;

@RestController
@RequestMapping("/api/envios")
public class EnvioController {

    @Autowired
    private EnvioService envioService;

    // ✅ Listar todos los envíos
    @GetMapping
    public List<Envio> listar() {
        return envioService.listarTodos();
    }

    // ✅ Obtener envío por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        return envioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // ✅ Crear nuevo envío
    @PostMapping
    public ResponseEntity<Envio> crear(@RequestBody Envio envio) {
        return ResponseEntity.ok(envioService.crear(envio));
    }

    // ✅ Eliminar (lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return envioService.eliminar(id)
                ? ResponseEntity.ok("🚫 Envío eliminado.")
                : ResponseEntity.notFound().build();
    }

    // ✅ Avanzar estado del envío
    @PostMapping("/{id}/avanzar")
    public ResponseEntity<?> avanzar(@PathVariable Long id) {
        return envioService.avanzarEstado(id)
                .map(e -> ResponseEntity.ok("✅ Estado avanzado."))
                .orElse(ResponseEntity.badRequest().body("⚠️ No se pudo avanzar el estado."));
    }

    // ✅ Marcar envío como devuelto
    @PostMapping("/{id}/devolver")
    public ResponseEntity<?> devolver(@PathVariable Long id) {
        return envioService.devolver(id)
                .map(e -> ResponseEntity.ok("🔄 Envío marcado como devuelto."))
                .orElse(ResponseEntity.badRequest().body("⚠️ No se pudo devolver el envío."));
    }

    // ✅ Cancelar envío
    @PostMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Long id) {
        return envioService.cancelar(id)
                .map(e -> ResponseEntity.ok("❌ Envío cancelado."))
                .orElse(ResponseEntity.badRequest().body("⚠️ No se pudo cancelar el envío."));
    }

}