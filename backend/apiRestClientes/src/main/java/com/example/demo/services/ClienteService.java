package com.example.demo.services;

import com.example.demo.models.Cliente;
import com.example.demo.repositories.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    // Listar todos los clientes no eliminados
    public List<Cliente> listarClientes() {
        return clienteRepository.findByEliminadoFalse();
    }

    // Buscar un cliente por su ID (solo si no está eliminado)
    public Optional<Cliente> obtenerClientePorId(Long id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        return cliente.filter(c -> !c.getEliminado());
    }

    // Crear o actualizar un cliente
    public Cliente guardarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // Actualizar un cliente existente
    public Optional<Cliente> actualizarCliente(Long id, Cliente clienteActualizado) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(id);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            cliente.setNombre(clienteActualizado.getNombre());
            cliente.setCorreo(clienteActualizado.getCorreo());
            cliente.setTelefono(clienteActualizado.getTelefono());
            cliente.setDireccion(clienteActualizado.getDireccion());
            return Optional.of(clienteRepository.save(cliente));
        }
        return Optional.empty();
    }

    // Eliminar un cliente lógicamente (marcar como eliminado)
    public boolean eliminarCliente(Long id) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(id);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            cliente.setEliminado(true);
            clienteRepository.save(cliente);
            return true;
        }
        return false;
    }
}
