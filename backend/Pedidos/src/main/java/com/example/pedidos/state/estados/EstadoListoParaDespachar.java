package com.example.pedidos.state.estados;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.state.EstadoPedidoState;

public class EstadoListoParaDespachar implements EstadoPedidoState {
    @Override
    public void avanzar(Pedido pedido) {
        pedido.setEstado("Listo para pagar");
    }

    @Override
    public void cancelar(Pedido pedido) {
        pedido.setEstado("Cancelado");
    }

    @Override
    public String nombreEstado() {
        return "Listo para despachar";
    }
}
