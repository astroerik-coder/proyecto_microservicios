package com.example.pedidos.state.estados;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.state.EstadoPedidoState;

public class EstadoProcesando implements EstadoPedidoState {

    @Override
    public void avanzar(Pedido pedido) {
        pedido.setEstado("Listo para envío");
    }

    @Override
    public void cancelar(Pedido pedido) {
        pedido.setEstado("Cancelado");
    }

    @Override
    public String nombreEstado() {
        return "Procesando";
    }
}