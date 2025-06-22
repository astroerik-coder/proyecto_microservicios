package com.example.inventario.models.dto;

public class ProductoInfoEvent {
    private Long idPedido;
    private Long idProducto;
    private String nombreProducto;
    private Double precioUnitario;

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

    // Getter y Setter para nombreProducto
    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    // Getter y Setter para precioUnitario
    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}
