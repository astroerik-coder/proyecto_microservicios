package com.example.pedidos.models.dto;

import java.io.Serializable;

public class PedidoListoParaPagarEvent implements Serializable {
    private Long idPedido;

    public PedidoListoParaPagarEvent() {}

    public PedidoListoParaPagarEvent(Long idPedido) {
        this.idPedido = idPedido;
    }

    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }
}