package com.example.demo.models.dto;

import java.util.List;

public class PedidoDTO {
private Long id;
private Long idCliente;
private String estado;
private Double total;
private List<LineaPedidoDTO> lineas;
// Getters y setters
public Long getId() { return id; }
public void setId(Long id) { this.id = id; }

public Long getIdCliente() { return idCliente; }
public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }

public String getEstado() { return estado; }
public void setEstado(String estado) { this.estado = estado; }

public Double getTotal() { return total; }
public void setTotal(Double total) { this.total = total; }

public List<LineaPedidoDTO> getLineas() { return lineas; }
public void setLineas(List<LineaPedidoDTO> lineas) { this.lineas = lineas; }

}