package com.example.demo.models.dtos;

public class ProductoConsultaEvent {

    private Long idPedido;
    private Long idProducto;
    private Integer cantidad;

    // Getter y Setter para idPedido
    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    // Getter y Setter para idProducto
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    // Getter y Setter para cantidad
    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}
