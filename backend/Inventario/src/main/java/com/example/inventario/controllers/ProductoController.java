package com.example.inventario.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventario.models.Producto;
import com.example.inventario.services.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // ✅ Listar todos los productos
    @GetMapping
    public List<Producto> listarProductos() {
        return productoService.listarProductos();
    }

    // ✅ Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoService.obtenerProductoPorId(id);
        return producto.isPresent()
                ? ResponseEntity.ok(producto.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Buscar productos por nombre
    @GetMapping("/buscar")
    public List<Producto> buscarPorNombre(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }

    // ✅ Crear nuevo producto
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevo = productoService.crearProducto(producto);
        return ResponseEntity.ok(nuevo);
    }

    // ✅ Actualizar producto existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        Optional<Producto> actualizado = productoService.actualizarProducto(id, producto);
        return actualizado.isPresent()
                ? ResponseEntity.ok(actualizado.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Eliminar producto (lógicamente)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        boolean eliminado = productoService.eliminarProducto(id);
        return eliminado
                ? ResponseEntity.ok("Producto eliminado lógicamente.")
                : ResponseEntity.notFound().build();
    }

    // ✅ Disminuir stock
    @PutMapping("/{id}/disminuir-stock")
    public ResponseEntity<?> disminuirStock(@PathVariable Long id, @RequestParam int cantidad) {
        boolean ok = productoService.disminuirStock(id, cantidad);
        return ok
                ? ResponseEntity.ok("Stock actualizado correctamente.")
                : ResponseEntity.badRequest().body("Stock insuficiente o producto no encontrado.");
    }

    @PutMapping("/{id}/liberar-stock")
    public ResponseEntity<?> liberarStock(@PathVariable Long id, @RequestParam int cantidad) {
        boolean ok = productoService.liberarStock(id, cantidad);
        return ok
                ? ResponseEntity.ok("Stock liberado correctamente.")
                : ResponseEntity.badRequest().body("Producto no encontrado o error al liberar.");
    }

}