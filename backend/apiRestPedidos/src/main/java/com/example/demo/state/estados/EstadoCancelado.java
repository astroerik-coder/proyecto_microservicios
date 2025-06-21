package com.example.demo.state.estados;

import com.example.demo.models.Pedido;
import com.example.demo.state.EstadoPedidoState;

public class EstadoCancelado implements EstadoPedidoState {

    @Override
    public void avanzar(Pedido pedido) {
        System.out.println("El pedido fue cancelado. No se puede avanzar.");
    }

    @Override
    public void cancelar(Pedido pedido) {
        System.out.println("El pedido ya está cancelado.");
    }

    @Override
    public String nombreEstado() {
        return "Cancelado";
    }
}
