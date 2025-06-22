package com.example.pedidos.models.dto;

import java.util.List;

public class CrearPedidoDTO {
    private Long idCliente;
    private Double total;
    private List<LineaPedidoDTO> lineas;

    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public List<LineaPedidoDTO> getLineas() { return lineas; }
    public void setLineas(List<LineaPedidoDTO> lineas) { this.lineas = lineas; }
}