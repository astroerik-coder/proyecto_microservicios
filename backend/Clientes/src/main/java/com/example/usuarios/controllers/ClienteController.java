package com.example.usuarios.controllers;

import com.example.usuarios.models.Cliente;
import com.example.usuarios.services.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // Obtener todos los clientes
    @GetMapping
    public ResponseEntity<List<Cliente>> listar() {
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    // Obtener un cliente por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtener(@PathVariable Long id) {
        return clienteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Registrar un nuevo cliente
    @PostMapping
    public ResponseEntity<Cliente> registrar(@RequestBody Cliente nuevo) {
        Cliente guardado = clienteService.registrar(nuevo);
        return ResponseEntity.ok(guardado);
    }

    // Actualizar los datos de un cliente
    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable Long id, @RequestBody Cliente datos) {
        return clienteService.actualizar(id, datos)
                .map(c -> ResponseEntity.ok("Cliente actualizado correctamente."))
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar un cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        boolean eliminado = clienteService.eliminar(id);
        return eliminado
                ? ResponseEntity.ok("Cliente eliminado.")
                : ResponseEntity.notFound().build();
    }
}
