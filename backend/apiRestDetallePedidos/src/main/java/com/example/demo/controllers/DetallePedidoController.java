package com.example.demo.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.DetallePedido;
import com.example.demo.services.DetallePedidoService;

@RestController
@RequestMapping("/api/detalles-pedido")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    // ✅ Listar todos los detalles
    @GetMapping
    public List<DetallePedido> listarTodos() {
        return detallePedidoService.listarDetalles();
    }

    // ✅ Obtener detalle por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        Optional<DetallePedido> detalle = detallePedidoService.obtenerPorId(id);
        return detalle.isPresent()
                ? ResponseEntity.ok(detalle.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Obtener todos los detalles de un pedido específico
    @GetMapping("/pedido/{idPedido}")
    public List<DetallePedido> listarPorPedido(@PathVariable Long idPedido) {
        return detallePedidoService.listarPorPedido(idPedido);
    }

    // ✅ Crear nuevo detalle de pedido
    @PostMapping
    public ResponseEntity<DetallePedido> crearDetalle(@RequestBody DetallePedido detalle) {
        DetallePedido nuevo = detallePedidoService.crearDetalle(detalle);
        return ResponseEntity.ok(nuevo);
    }

    // ✅ Actualizar detalle de pedido
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarDetalle(@PathVariable Long id, @RequestBody DetallePedido detalle) {
        Optional<DetallePedido> actualizado = detallePedidoService.actualizarDetalle(id, detalle);
        return actualizado.isPresent()
                ? ResponseEntity.ok(actualizado.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Eliminar detalle lógicamente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDetalle(@PathVariable Long id) {
        boolean eliminado = detallePedidoService.eliminarDetalle(id);
        return eliminado
                ? ResponseEntity.ok("Detalle eliminado correctamente.")
                : ResponseEntity.notFound().build();
    }
}