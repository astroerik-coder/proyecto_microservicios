package com.example.demo.controllers;

import com.example.demo.dto.RegistroRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.ActualizarPasswordRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.UsuarioRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.services.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Registrar usuario
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegistroRequest request) {
        try {
            AuthResponse response = usuarioService.registrarUsuario(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Registro inválido",
                    "message", ex.getMessage()));
        }
    }

    // Login usuario
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = usuarioService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Credenciales inválidas",
                    "message", ex.getMessage()));
        }
    }

    // (Opcional) Obtener datos desde JWT
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

    @PutMapping("/{id}/password")
    public ResponseEntity<?> actualizarPassword(
            @PathVariable Long id,
            @RequestBody ActualizarPasswordRequest request) {

        try {
            boolean actualizado = usuarioService.actualizarPassword(
                    id,
                    request.getContraseñaActual(),
                    request.getNuevaContraseña());

            return actualizado
                    ? ResponseEntity.ok("Contraseña actualizada correctamente.")
                    : ResponseEntity.notFound().build();

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Validación fallida",
                    "message", ex.getMessage()));
        }
    }

}
