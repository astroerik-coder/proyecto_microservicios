package com.example.pedidos.models;

import javax.persistence.*;
import java.sql.Timestamp;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@Entity
@Table(name = "pedidos")
@ApiModel(description = "Modelo de Pedido para la gestión de pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(value = "ID único del pedido", example = "1", readOnly = true)
    private Long id;

    @Column(name = "id_cliente", nullable = false)
    @ApiModelProperty(value = "ID del cliente que realiza el pedido", example = "123", required = true)
    private Long idCliente;

    @Column(name = "fecha_pedido", nullable = false, updatable = false)
    @ApiModelProperty(value = "Fecha y hora de creación del pedido", example = "2024-01-15T10:30:00", readOnly = true)
    private Timestamp fechaPedido;

    @Column(name = "estado")
    @ApiModelProperty(value = "Estado actual del pedido", example = "Recibido", allowableValues = "Recibido,EnPreparacion,ListoParaEnvio,Enviado,Entregado,Cancelado")
    private String estado = "Recibido"; // Usaremos el patrón State para controlar esto

    @ApiModelProperty(value = "Total del pedido", example = "299.99")
    private Double total = 0.0;

    @ApiModelProperty(value = "Indica si el pedido está eliminado lógicamente", example = "false", readOnly = true)
    private Boolean eliminado = false;

    @PrePersist
    protected void onCreate() {
        this.fechaPedido = new Timestamp(System.currentTimeMillis());
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public Timestamp getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(Timestamp fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Boolean getEliminado() {
        return eliminado;
    }

    public void setEliminado(Boolean eliminado) {
        this.eliminado = eliminado;
    }
}