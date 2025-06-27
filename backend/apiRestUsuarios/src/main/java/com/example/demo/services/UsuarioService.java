package com.example.demo.services;

import com.example.demo.models.Usuario;
import com.example.demo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ✅ Crear usuario sin login automático
    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // ✅ Obtener todos los usuarios activos
    public List<Usuario> obtenerTodosActivos() {
        return usuarioRepository.findByActivoTrue();
    }

    // ✅ Buscar por ID
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id).filter(Usuario::isActivo);
    }

    // ✅ Actualizar
    public Optional<Usuario> actualizarUsuario(Long id, Usuario actualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNombreUsuario(actualizado.getNombreUsuario());
                    usuario.setCorreo(actualizado.getCorreo());
                    usuario.setRol(actualizado.getRol());
                    usuario.setTelefono(actualizado.getTelefono());
                    usuario.setDireccion(actualizado.getDireccion());
                    usuario.setCedula(actualizado.getCedula());
                    usuario.setGenero(actualizado.getGenero());
                    usuario.setImagenUrl(actualizado.getImagenUrl());
                    return usuarioRepository.save(usuario);
                });
    }

    // ✅ Borrado lógico
    public boolean eliminarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setActivo(false);
                    usuarioRepository.save(usuario);
                    return true;
                }).orElse(false);
    }
}
