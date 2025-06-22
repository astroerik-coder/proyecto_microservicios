package com.example.pedidos.controllers;

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

import com.example.pedidos.models.Pedido;
import com.example.pedidos.services.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // ✅ Obtener todos los pedidos
    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.listarPedidos();
    }

    // ✅ Obtener un pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.obtenerPedidoPorId(id);
        return pedido.isPresent()
                ? ResponseEntity.ok(pedido.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Crear nuevo pedido
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        Pedido nuevo = pedidoService.crearPedido(pedido);
        return ResponseEntity.ok(nuevo);
    }

    // ✅ Avanzar estado del pedido
    @PutMapping("/{id}/avanzar")
    public ResponseEntity<?> avanzarEstado(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.avanzarEstado(id);
        return pedido.isPresent()
                ? ResponseEntity.ok(pedido.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Cancelar un pedido
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.cancelarPedido(id);
        return pedido.isPresent()
                ? ResponseEntity.ok(pedido.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Eliminar (lógicamente) un pedido
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPedido(@PathVariable Long id) {
        boolean eliminado = pedidoService.eliminarPedido(id);
        return eliminado
                ? ResponseEntity.ok("Pedido eliminado lógicamente.")
                : ResponseEntity.notFound().build();
    }
}