package com.example.usuarios.controllers;

import com.example.usuarios.models.Usuario;
import com.example.usuarios.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestión general de usuarios (CRUD).
 * Puede ser usado por administradores o sistemas internos.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // ✅ Obtener todos los usuarios activos
    @GetMapping
    public ResponseEntity<List<Usuario>> listarActivos() {
        return ResponseEntity.ok(usuarioService.obtenerTodosActivos());
    }

    // ✅ Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Actualizar usuario completo
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario actualizado) {
        return usuarioService.actualizarUsuario(id, actualizado)
                .map(u -> ResponseEntity.ok("Usuario actualizado."))
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Eliminar usuario (lógicamente)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        boolean eliminado = usuarioService.eliminarUsuario(id);
        return eliminado
                ? ResponseEntity.ok("Usuario desactivado.")
                : ResponseEntity.notFound().build();
    }
}
