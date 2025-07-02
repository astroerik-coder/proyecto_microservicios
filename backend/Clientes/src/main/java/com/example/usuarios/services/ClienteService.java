package com.example.usuarios.services;

import com.example.usuarios.models.Cliente;
import com.example.usuarios.repositories.ClienteRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepositorio clienteRepositorio;

    public Cliente registrar(Cliente cliente) {
        return clienteRepositorio.save(cliente);
    }

    public List<Cliente> listarTodos() {
        return clienteRepositorio.findAll();
    }

    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepositorio.findById(id);
    }

    public Optional<Cliente> actualizar(Long id, Cliente datos) {
        return clienteRepositorio.findById(id).map(c -> {
            c.setNombreUsuario(datos.getNombreUsuario());
            c.setCorreo(datos.getCorreo());
            c.setTelefono(datos.getTelefono());
            c.setDireccion(datos.getDireccion());
            c.setCedula(datos.getCedula());
            c.setGenero(datos.getGenero());
            return clienteRepositorio.save(c);
        });
    }

    public boolean eliminar(Long id) {
        return clienteRepositorio.findById(id).map(c -> {
            clienteRepositorio.delete(c);
            return true;
        }).orElse(false);
    }
}
