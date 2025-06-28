package com.example.demo.models.dto;

import java.io.Serializable;

public class PagoExitosoEvent implements Serializable {
    private Long idPedido;

    public PagoExitosoEvent() {}

    public PagoExitosoEvent(Long idPedido) {
        this.idPedido = idPedido;
    }

    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }
}