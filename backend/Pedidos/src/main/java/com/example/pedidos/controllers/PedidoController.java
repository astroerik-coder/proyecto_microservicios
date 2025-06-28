package com.example.pedidos.controllers;

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
import org.springframework.web.bind.annotation.RestController;

import com.example.pedidos.models.DetallePedido;
import com.example.pedidos.models.Pedido;
import com.example.pedidos.models.dto.CrearPedidoDTO;
import com.example.pedidos.services.PedidoService;
import com.example.pedidos.services.Publisher.ProductoConsultaPublisher;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@RestController
@RequestMapping("/api/pedidos")
@Api(tags = "Gestión de Pedidos", description = "Operaciones para gestionar pedidos")
public class PedidoController {

        @Autowired
        private PedidoService pedidoService;
        @Autowired
        private ProductoConsultaPublisher productoConsultaPublisher;

        // ✅ Obtener todos los pedidos
        @GetMapping
        @ApiOperation(value = "Listar todos los pedidos", notes = "Retorna una lista de todos los pedidos en el sistema")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Lista de pedidos obtenida exitosamente"),
                        @ApiResponse(code = 500, message = "Error interno del servidor")
        })
        public List<Pedido> listarPedidos() {
                return pedidoService.listarPedidos();
        }

        // ✅ Obtener pedidos por ID de cliente
        @GetMapping("/cliente/{clienteId}")
        @ApiOperation(value = "Obtener pedidos por cliente", notes = "Retorna todos los pedidos realizados por un cliente específico")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Pedidos obtenidos exitosamente"),
                        @ApiResponse(code = 404, message = "No se encontraron pedidos para este cliente")
        })
        public ResponseEntity<?> obtenerPedidosPorCliente(
                        @ApiParam(value = "ID del cliente", required = true, example = "123") @PathVariable Long clienteId) {

                List<Pedido> pedidos = pedidoService.obtenerPedidosPorCliente(clienteId);

                return pedidos.isEmpty()
                                ? ResponseEntity.status(404)
                                                .body("No se encontraron pedidos para el cliente con ID " + clienteId)
                                : ResponseEntity.ok(pedidos);
        }

        // ✅ Obtener un pedido por ID
        @GetMapping("/{id}")
        @ApiOperation(value = "Obtener pedido por ID", notes = "Retorna un pedido específico basado en su ID")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Pedido encontrado exitosamente"),
                        @ApiResponse(code = 404, message = "Pedido no encontrado")
        })
        public ResponseEntity<?> obtenerPedido(
                        @ApiParam(value = "ID del pedido", required = true, example = "1") @PathVariable Long id) {
                Optional<Pedido> pedido = pedidoService.obtenerPedidoPorId(id);
                return pedido.isPresent()
                                ? ResponseEntity.ok(pedido.get())
                                : ResponseEntity.notFound().build();
        }

        // ✅ Crear nuevo pedido
        @PostMapping
        public ResponseEntity<Pedido> crearPedido(@RequestBody CrearPedidoDTO dto) {
                Pedido nuevo = pedidoService.crearPedido(dto);

                for (DetallePedido detalle : nuevo.getDetalles()) {
                        productoConsultaPublisher.publicarSolicitud(
                                        nuevo.getId(),
                                        detalle.getIdProducto(),
                                        detalle.getCantidad());
                }

                return ResponseEntity.ok(nuevo);
        }

        // ✅ Avanzar estado del pedido
        @PutMapping("/{id}/avanzar")
        @ApiOperation(value = "Avanzar estado del pedido", notes = "Avanza el estado del pedido al siguiente nivel en el flujo de trabajo")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Estado del pedido avanzado exitosamente"),
                        @ApiResponse(code = 404, message = "Pedido no encontrado"),
                        @ApiResponse(code = 400, message = "No se puede avanzar el estado del pedido")
        })
        public ResponseEntity<?> avanzarEstado(
                        @ApiParam(value = "ID del pedido", required = true, example = "1") @PathVariable Long id) {
                Optional<Pedido> pedido = pedidoService.avanzarEstado(id);
                return pedido.isPresent()
                                ? ResponseEntity.ok(pedido.get())
                                : ResponseEntity.notFound().build();
        }

        // ✅ Cancelar un pedido
        @PutMapping("/{id}/cancelar")
        @ApiOperation(value = "Cancelar pedido", notes = "Cancela un pedido existente")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Pedido cancelado exitosamente"),
                        @ApiResponse(code = 404, message = "Pedido no encontrado"),
                        @ApiResponse(code = 400, message = "No se puede cancelar el pedido")
        })
        public ResponseEntity<?> cancelarPedido(
                        @ApiParam(value = "ID del pedido", required = true, example = "1") @PathVariable Long id) {
                Optional<Pedido> pedido = pedidoService.cancelarPedido(id);
                return pedido.isPresent()
                                ? ResponseEntity.ok(pedido.get())
                                : ResponseEntity.notFound().build();
        }

        // ✅ Eliminar (lógicamente) un pedido
        @DeleteMapping("/{id}")
        @ApiOperation(value = "Eliminar pedido", notes = "Elimina lógicamente un pedido del sistema")
        @ApiResponses(value = {
                        @ApiResponse(code = 200, message = "Pedido eliminado exitosamente"),
                        @ApiResponse(code = 404, message = "Pedido no encontrado")
        })
        public ResponseEntity<?> eliminarPedido(
                        @ApiParam(value = "ID del pedido a eliminar", required = true, example = "1") @PathVariable Long id) {
                boolean eliminado = pedidoService.eliminarPedido(id);
                return eliminado
                                ? ResponseEntity.ok("Pedido eliminado lógicamente.")
                                : ResponseEntity.notFound().build();
        }
}