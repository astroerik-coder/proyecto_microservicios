package com.example.demo.state;

import com.example.demo.models.Pedido;

public interface EstadoPedidoState {
    void avanzar(Pedido pedido);
    void cancelar(Pedido pedido);
    String nombreEstado();
}