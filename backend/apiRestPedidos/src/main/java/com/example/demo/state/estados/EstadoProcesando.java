package com.example.demo.state.estados;

import com.example.demo.models.Pedido;
import com.example.demo.state.EstadoPedidoState;

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