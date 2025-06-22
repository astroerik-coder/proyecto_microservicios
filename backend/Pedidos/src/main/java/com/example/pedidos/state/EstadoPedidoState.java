package com.example.pedidos.state;

import com.example.pedidos.models.Pedido;

public interface EstadoPedidoState {
    void avanzar(Pedido pedido);
    void cancelar(Pedido pedido);
    String nombreEstado();
}