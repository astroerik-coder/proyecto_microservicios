package com.example.pagos.controllers;

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

import com.example.pagos.models.Cobro;
import com.example.pagos.services.CobroService;

@RestController
@RequestMapping("/api/cobros")
public class CobroController {

    @Autowired
    private CobroService cobroService;

    // ✅ Listar todos los cobros activos
    @GetMapping
    public List<Cobro> listarTodos() {
        return cobroService.listarTodos();
    }

    // ✅ Obtener cobro por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return cobroService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Listar cobros por pedido
    @GetMapping("/pedido/{idPedido}")
    public List<Cobro> listarPorPedido(@PathVariable Long idPedido) {
        return cobroService.listarPorPedido(idPedido);
    }

    // ✅ Crear nuevo cobro
    @PostMapping
    public ResponseEntity<Cobro> crear(@RequestBody Cobro cobro) {
        return ResponseEntity.ok(cobroService.crearCobro(cobro));
    }

    // ✅ Eliminar lógicamente un cobro
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        boolean eliminado = cobroService.eliminarCobro(id);
        return eliminado
                ? ResponseEntity.ok("Cobro eliminado correctamente.")
                : ResponseEntity.notFound().build();
    }

    // ✅ Cambiar estado: procesar pago
    @PostMapping("/{id}/procesar")
    public ResponseEntity<?> procesarPago(@PathVariable Long id) {
        return cobroService.procesarPago(id)
                .map(c -> ResponseEntity.ok("✅ Pago procesado."))
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Cambiar estado: marcar como fallido
    @PostMapping("/{id}/fallido")
    public ResponseEntity<?> marcarFallido(@PathVariable Long id) {
        return cobroService.marcarFallido(id)
                .map(c -> ResponseEntity.ok("⚠️ Cobro marcado como fallido."))
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Cambiar estado: reintentar cobro
    @PostMapping("/{id}/reintentar")
    public ResponseEntity<?> reintentarCobro(@PathVariable Long id) {
        return cobroService.reintentarCobro(id)
                .map(c -> ResponseEntity.ok("🔁 Reintento aplicado."))
                .orElse(ResponseEntity.notFound().build());
    }
}
