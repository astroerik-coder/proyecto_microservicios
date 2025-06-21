package com.example.demo.models;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String descripcion;

    private Integer stock;

    private Double precio;

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

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Boolean getEliminado() { return eliminado; }
    public void setEliminado(Boolean eliminado) { this.eliminado = eliminado; }

    public Timestamp getCreado_en() { return creado_en; }
    public void setCreado_en(Timestamp creado_en) { this.creado_en = creado_en; }

    public Timestamp getActualizado_en() { return actualizado_en; }
    public void setActualizado_en(Timestamp actualizado_en) { this.actualizado_en = actualizado_en; }
}