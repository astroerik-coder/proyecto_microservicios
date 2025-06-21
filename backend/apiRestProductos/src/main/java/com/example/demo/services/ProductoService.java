package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Producto;
import com.example.demo.repositories.ProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Listar todos los productos no eliminados
    public List<Producto> listarProductos() {
        return productoRepository.findByEliminadoFalse();
    }

    // Buscar producto por ID
    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepository.findByIdAndEliminadoFalse(id);
    }

    // Buscar por nombre
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCaseAndEliminadoFalse(nombre);
    }

    // Crear producto
    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Actualizar producto existente
    public Optional<Producto> actualizarProducto(Long id, Producto datosActualizados) {
        Optional<Producto> optional = productoRepository.findByIdAndEliminadoFalse(id);
        if (optional.isPresent()) {
            Producto producto = optional.get();
            producto.setNombre(datosActualizados.getNombre());
            producto.setDescripcion(datosActualizados.getDescripcion());
            producto.setPrecio(datosActualizados.getPrecio());
            producto.setStock(datosActualizados.getStock());
            return Optional.of(productoRepository.save(producto));
        }
        return Optional.empty();
    }

    // Eliminar lógicamente
    public boolean eliminarProducto(Long id) {
        Optional<Producto> optional = productoRepository.findByIdAndEliminadoFalse(id);
        if (optional.isPresent()) {
            Producto producto = optional.get();
            producto.setEliminado(true);
            productoRepository.save(producto);
            return true;
        }
        return false;
    }

    // Disminuir stock (por despacho)
    public boolean disminuirStock(Long id, int cantidad) {
        Optional<Producto> optional = productoRepository.findByIdAndEliminadoFalse(id);
        if (optional.isPresent()) {
            Producto producto = optional.get();
            if (producto.getStock() >= cantidad) {
                producto.setStock(producto.getStock() - cantidad);
                productoRepository.save(producto);
                return true;
            }
        }
        return false;
    }

    public boolean liberarStock(Long id, int cantidad) {
    Optional<Producto> optional = productoRepository.findByIdAndEliminadoFalse(id);
    if (optional.isPresent()) {
        Producto producto = optional.get();
        producto.setStock(producto.getStock() + cantidad);
        productoRepository.save(producto);
        return true;
    }
    return false;
}

}