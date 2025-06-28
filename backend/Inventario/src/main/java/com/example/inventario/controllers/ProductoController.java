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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.example.inventario.models.Producto;
import com.example.inventario.services.ProductoService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@RestController
@RequestMapping("/api/productos")
@Api(tags = "Gestión de Productos", description = "Operaciones para gestionar el inventario de productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // ✅ Listar todos los productos
    @GetMapping
    @ApiOperation(value = "Listar todos los productos", notes = "Retorna una lista de todos los productos disponibles en el inventario")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Lista de productos obtenida exitosamente"),
            @ApiResponse(code = 500, message = "Error interno del servidor")
    })
    public ResponseEntity<Page<Producto>> listarProductos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Producto> productos = productoService.listarProductosPaginado(pageable);
        return ResponseEntity.ok(productos);
    }

    // ✅ Obtener producto por ID
    @GetMapping("/{id}")
    @ApiOperation(value = "Obtener producto por ID", notes = "Retorna un producto específico basado en su ID")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Producto encontrado exitosamente"),
            @ApiResponse(code = 404, message = "Producto no encontrado")
    })
    public ResponseEntity<?> obtenerPorId(
            @ApiParam(value = "ID del producto", required = true, example = "1") @PathVariable Long id) {
        Optional<Producto> producto = productoService.obtenerProductoPorId(id);
        return producto.isPresent()
                ? ResponseEntity.ok(producto.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Buscar productos por nombre
    @GetMapping("/buscar")
    @ApiOperation(value = "Buscar productos por nombre", notes = "Busca productos que contengan el nombre especificado")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Búsqueda realizada exitosamente"),
            @ApiResponse(code = 500, message = "Error interno del servidor")
    })
    public List<Producto> buscarPorNombre(
            @ApiParam(value = "Nombre del producto a buscar", required = true, example = "laptop") @RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }

    // ✅ Crear nuevo producto
    @PostMapping
    @ApiOperation(value = "Crear nuevo producto", notes = "Crea un nuevo producto en el inventario")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Producto creado exitosamente"),
            @ApiResponse(code = 400, message = "Datos del producto inválidos"),
            @ApiResponse(code = 500, message = "Error interno del servidor")
    })
    public ResponseEntity<Producto> crearProducto(
            @ApiParam(value = "Datos del producto a crear", required = true) @RequestBody Producto producto) {
        Producto nuevo = productoService.crearProducto(producto);
        return ResponseEntity.ok(nuevo);
    }

    // ✅ Actualizar producto existente
    @PutMapping("/{id}")
    @ApiOperation(value = "Actualizar producto", notes = "Actualiza los datos de un producto existente")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Producto actualizado exitosamente"),
            @ApiResponse(code = 404, message = "Producto no encontrado"),
            @ApiResponse(code = 400, message = "Datos del producto inválidos")
    })
    public ResponseEntity<?> actualizarProducto(
            @ApiParam(value = "ID del producto a actualizar", required = true, example = "1") @PathVariable Long id,
            @ApiParam(value = "Datos actualizados del producto", required = true) @RequestBody Producto producto) {
        Optional<Producto> actualizado = productoService.actualizarProducto(id, producto);
        return actualizado.isPresent()
                ? ResponseEntity.ok(actualizado.get())
                : ResponseEntity.notFound().build();
    }

    // ✅ Eliminar producto (lógicamente)
    @DeleteMapping("/{id}")
    @ApiOperation(value = "Eliminar producto", notes = "Elimina lógicamente un producto del inventario")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Producto eliminado exitosamente"),
            @ApiResponse(code = 404, message = "Producto no encontrado")
    })
    public ResponseEntity<?> eliminarProducto(
            @ApiParam(value = "ID del producto a eliminar", required = true, example = "1") @PathVariable Long id) {
        boolean eliminado = productoService.eliminarProducto(id);
        return eliminado
                ? ResponseEntity.ok("Producto eliminado lógicamente.")
                : ResponseEntity.notFound().build();
    }

    // ✅ Disminuir stock
    @PutMapping("/{id}/disminuir-stock")
    @ApiOperation(value = "Disminuir stock", notes = "Disminuye la cantidad de stock disponible de un producto")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Stock actualizado exitosamente"),
            @ApiResponse(code = 400, message = "Stock insuficiente o producto no encontrado"),
            @ApiResponse(code = 404, message = "Producto no encontrado")
    })
    public ResponseEntity<?> disminuirStock(
            @ApiParam(value = "ID del producto", required = true, example = "1") @PathVariable Long id,
            @ApiParam(value = "Cantidad a disminuir", required = true, example = "5") @RequestParam int cantidad) {
        boolean ok = productoService.disminuirStock(id, cantidad);
        return ok
                ? ResponseEntity.ok("Stock actualizado correctamente.")
                : ResponseEntity.badRequest().body("Stock insuficiente o producto no encontrado.");
    }

    @PutMapping("/{id}/liberar-stock")
    @ApiOperation(value = "Liberar stock", notes = "Libera stock reservado de un producto")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Stock liberado exitosamente"),
            @ApiResponse(code = 400, message = "Error al liberar stock o producto no encontrado"),
            @ApiResponse(code = 404, message = "Producto no encontrado")
    })
    public ResponseEntity<?> liberarStock(
            @ApiParam(value = "ID del producto", required = true, example = "1") @PathVariable Long id,
            @ApiParam(value = "Cantidad a liberar", required = true, example = "3") @RequestParam int cantidad) {
        boolean ok = productoService.liberarStock(id, cantidad);
        return ok
                ? ResponseEntity.ok("Stock liberado correctamente.")
                : ResponseEntity.badRequest().body("Producto no encontrado o error al liberar.");
    }

}