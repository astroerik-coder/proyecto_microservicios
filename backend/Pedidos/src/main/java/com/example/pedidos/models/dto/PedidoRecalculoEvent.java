package com.example.pedidos.models.dto;

public class PedidoRecalculoEvent {
    private Long idPedido;
    private Double nuevoTotal;

    // Getter y Setter para idPedido
    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    // Getter y Setter para nuevoTotal
    public Double getNuevoTotal() {
        return nuevoTotal;
    }

    public void setNuevoTotal(Double nuevoTotal) {
        this.nuevoTotal = nuevoTotal;
    }
}
