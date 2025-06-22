package com.example.pedidos.state.estados;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.state.EstadoPedidoState;

public class EstadoListoParaEnvio implements EstadoPedidoState {

    @Override
    public void avanzar(Pedido pedido) {
        EstadoEnviado siguiente = new EstadoEnviado();
        pedido.setEstado(siguiente.nombreEstado());
    }

    @Override
    public void cancelar(Pedido pedido) {
        EstadoCancelado siguiente = new EstadoCancelado();
        pedido.setEstado(siguiente.nombreEstado());
    }

    @Override
    public String nombreEstado() {
        return "Listo para envío";
    }
}