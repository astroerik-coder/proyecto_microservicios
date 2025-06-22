package com.example.demo.models.dtos;

import java.util.List;

public class PedidoEventDTO {
    private Long id;
    private Long idCliente;
    private Double total;
    private List<LineaPedidoDTO> lineas;

    // Getter y Setter para id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter y Setter para idCliente
    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    // Getter y Setter para total
    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    // Getter y Setter para lineas
    public List<LineaPedidoDTO> getLineas() {
        return lineas;
    }

    public void setLineas(List<LineaPedidoDTO> lineas) {
        this.lineas = lineas;
    }
}
