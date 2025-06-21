package com.example.demo.controllers;

import com.example.demo.dto.RegistroRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.UsuarioRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.services.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Registrar usuario
    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@RequestBody RegistroRequest request) {
        AuthResponse response = usuarioService.registrarUsuario(request);
        return ResponseEntity.ok(response);
    }

    // ✅ Login usuario
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = usuarioService.login(request);
        return ResponseEntity.ok(response);
    }

    // ✅ Editar usuario (por ID)
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody RegistroRequest request) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = optionalUsuario.get();
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setCorreo(request.getCorreo());
        usuario.setRol(request.getRol());

        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuario actualizado.");
    }

    // ✅ Eliminar usuario lógicamente (activo = false)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = optionalUsuario.get();
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuario desactivado.");
    }

    // ✅ (Opcional) Obtener datos desde JWT
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtUtil.validarToken(token)) {
            return ResponseEntity.status(401).body("Token inválido");
        }

        String username = jwtUtil.extraerNombreUsuario(token);
        String rol = jwtUtil.extraerRol(token);

        return ResponseEntity.ok("Usuario: " + username + ", Rol: " + rol);
    }
}
