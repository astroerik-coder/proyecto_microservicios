package com.example.demo.services;

import java.util.Optional;

import com.example.demo.dto.RegistroRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.UsuarioRepository;
import com.example.demo.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse registrarUsuario(RegistroRequest request) {
        if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
            throw new RuntimeException("Nombre de usuario ya existe.");
        }
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setCorreo(request.getCorreo());
        usuario.setContraseñaHash(passwordEncoder.encode(request.getContraseña()));
        usuario.setRol(request.getRol());

        usuarioRepository.save(usuario);

        String token = jwtUtil.generarToken(usuario);
        return new AuthResponse(token, usuario.getNombreUsuario(), usuario.getRol());
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(request.getNombreUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!usuario.isActivo()) {
            throw new RuntimeException("Usuario inactivo.");
        }

        if (!passwordEncoder.matches(request.getContraseña(), usuario.getContraseñaHash())) {
            throw new RuntimeException("Contraseña incorrecta.");
        }

        String token = jwtUtil.generarToken(usuario);
        return new AuthResponse(token, usuario.getNombreUsuario(), usuario.getRol());
    }
}