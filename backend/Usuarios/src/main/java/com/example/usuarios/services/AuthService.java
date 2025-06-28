package com.example.usuarios.services;

import java.util.Optional;

import com.example.usuarios.dto.RegistroRequest;
import com.example.usuarios.dto.LoginRequest;
import com.example.usuarios.dto.AuthResponse;
import com.example.usuarios.models.Usuario;
import com.example.usuarios.repositories.UsuarioRepository;
import com.example.usuarios.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

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
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());
        usuario.setCedula(request.getCedula());
        usuario.setGenero(request.getGenero());
        usuario.setImagenUrl(request.getImagenUrl());
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

    public boolean actualizarPassword(Long id, String contraseñaActual, String nuevaContraseña) {
    Optional<Usuario> optional = usuarioRepository.findById(id);

    if (optional.isEmpty()) return false;

    Usuario usuario = optional.get();

    // Verificamos la contraseña actual
    if (!passwordEncoder.matches(contraseñaActual, usuario.getContraseñaHash())) {
        throw new RuntimeException("La contraseña actual no es válida.");
    }

    // Actualizamos la nueva
    usuario.setContraseñaHash(passwordEncoder.encode(nuevaContraseña));
    usuarioRepository.save(usuario);
    return true;
}

}