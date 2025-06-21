package com.example.demo.models;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_cliente", nullable = false)
    private Long idCliente;

    @Column(name = "fecha_pedido", nullable = false, updatable = false)
    private Timestamp fechaPedido;

    @Column(name = "estado")
    private String estado = "Recibido"; // Usaremos el patrón State para controlar esto

    private Double total = 0.0;

    private Boolean eliminado = false;

    @PrePersist
    protected void onCreate() {
        this.fechaPedido = new Timestamp(System.currentTimeMillis());
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }

    public Timestamp getFechaPedido() { return fechaPedido; }
    public void setFechaPedido(Timestamp fechaPedido) { this.fechaPedido = fechaPedido; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Boolean getEliminado() { return eliminado; }
    public void setEliminado(Boolean eliminado) { this.eliminado = eliminado; }
}