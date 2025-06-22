package com.example.inventario.models;

import javax.persistence.*;
import java.sql.Timestamp;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@Entity
@Table(name = "productos")
@ApiModel(description = "Modelo de Producto para el inventario")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(value = "ID único del producto", example = "1", readOnly = true)
    private Long id;

    @ApiModelProperty(value = "Nombre del producto", example = "Laptop HP Pavilion", required = true)
    private String nombre;

    @ApiModelProperty(value = "Descripción detallada del producto", example = "Laptop HP Pavilion con procesador Intel i7, 16GB RAM, 512GB SSD")
    private String descripcion;

    @ApiModelProperty(value = "Cantidad disponible en stock", example = "50", required = true)
    private Integer stock;

    @ApiModelProperty(value = "Precio del producto", example = "999.99", required = true)
    private Double precio;

    @ApiModelProperty(value = "Indica si el producto está eliminado lógicamente", example = "false", readOnly = true)
    private Boolean eliminado = false;

    @ApiModelProperty(value = "Fecha de creación del producto", example = "2024-01-15T10:30:00", readOnly = true)
    private Timestamp creado_en;

    @ApiModelProperty(value = "Fecha de última actualización del producto", example = "2024-01-15T10:30:00", readOnly = true)
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