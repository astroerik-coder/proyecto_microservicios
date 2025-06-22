package com.example.pedidos.state.estados;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.state.EstadoPedidoState;

public class EstadoEnviado implements EstadoPedidoState {

    @Override
    public void avanzar(Pedido pedido) {
        // Ya está en estado final
        System.out.println("El pedido ya fue enviado. No se puede avanzar más.");
    }

    @Override
    public void cancelar(Pedido pedido) {
        System.out.println("El pedido ya fue enviado. No se puede cancelar.");
    }

    @Override
    public String nombreEstado() {
        return "Enviado";
    }
}