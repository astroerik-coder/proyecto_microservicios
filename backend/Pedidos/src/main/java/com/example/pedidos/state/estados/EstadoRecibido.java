package com.example.pedidos.state.estados;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.state.EstadoPedidoState;

public class EstadoRecibido implements EstadoPedidoState {

    @Override
    public void avanzar(Pedido pedido) {
        EstadoProcesando siguiente = new EstadoProcesando();
        pedido.setEstado(siguiente.nombreEstado());
    }

    @Override
    public void cancelar(Pedido pedido) {
        EstadoCancelado siguiente = new EstadoCancelado();
        pedido.setEstado(siguiente.nombreEstado());
    }

    @Override
    public String nombreEstado() {
        return "Recibido";
    }
}