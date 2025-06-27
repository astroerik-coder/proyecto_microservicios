package com.example.inventario.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventario.models.Producto;
import com.example.inventario.repositories.ProductoRepository;
import com.example.inventario.services.Publisher.ProductoActualizadoPublisher;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProductoActualizadoPublisher productoActualizadoPublisher;

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
        Producto creado = productoRepository.save(producto);
        productoActualizadoPublisher.publicarProductoActualizado(creado);
        return creado;
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

            Producto actualizado = productoRepository.save(producto);
            productoActualizadoPublisher.publicarProductoActualizado(actualizado);

            return Optional.of(actualizado);
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
            productoActualizadoPublisher.publicarProductoActualizado(producto);
            return true;
        }
        return false;
    }

    // Disminuir stock (por despacho)
    public boolean disminuirStock(Long idProducto, Integer cantidad) {
        return productoRepository.findById(idProducto)
                .map(producto -> {
                    if (producto.getStock() >= cantidad) {
                        producto.setStock(producto.getStock() - cantidad);
                        productoRepository.save(producto);
                        return true;
                    }
                    return false;
                }).orElse(false);
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