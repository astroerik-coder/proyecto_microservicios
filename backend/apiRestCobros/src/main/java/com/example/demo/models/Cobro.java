package com.example.demo.models;

import javax.persistence.*;

import com.state.EstadoPago;

import java.sql.Timestamp;

@Entity
@Table(name = "cobros")
public class Cobro {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_pedido", nullable = false)
    private Long idPedido;

    @Column(nullable = false)
    private Double monto;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago = MetodoPago.EFECTIVO;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago", nullable = false)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;

    @Column(name = "referencia_pago")
    private String referenciaPago;

    private Boolean eliminado = false;

    private Timestamp creado_en;
    private Timestamp actualizado_en;

    // === Callbacks automáticos ===
    @PrePersist
    protected void onCreate() {
        this.creado_en = new Timestamp(System.currentTimeMillis());
        this.actualizado_en = this.creado_en;
    }

    @PreUpdate
    protected void onUpdate() {
        this.actualizado_en = new Timestamp(System.currentTimeMillis());
    }

    // === Getters & Setters ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdPedido() { return idPedido; }
    public void setIdPedido(Long idPedido) { this.idPedido = idPedido; }

    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }

    public MetodoPago getMetodoPago() { return metodoPago; }
    public void setMetodoPago(MetodoPago metodoPago) { this.metodoPago = metodoPago; }

    public EstadoPago getEstadoPago() { return estadoPago; }
    public void setEstadoPago(EstadoPago estadoPago) { this.estadoPago = estadoPago; }

    public String getReferenciaPago() { return referenciaPago; }
    public void setReferenciaPago(String referenciaPago) { this.referenciaPago = referenciaPago; }

    public Boolean getEliminado() { return eliminado; }
    public void setEliminado(Boolean eliminado) { this.eliminado = eliminado; }

    public Timestamp getCreado_en() { return creado_en; }
    public void setCreado_en(Timestamp creado_en) { this.creado_en = creado_en; }

    public Timestamp getActualizado_en() { return actualizado_en; }
    public void setActualizado_en(Timestamp actualizado_en) { this.actualizado_en = actualizado_en; }
}


