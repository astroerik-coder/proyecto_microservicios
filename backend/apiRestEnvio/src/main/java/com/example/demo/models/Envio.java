package com.example.demo.models;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "envios")
public class Envio {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(name = "id_despacho", nullable = false)
private Long idDespacho;

@Enumerated(EnumType.STRING)
@Column(nullable = false)
private EstadoEnvio estado = EstadoEnvio.EN_TRANSITO;

private String transportista;

@Column(name = "guia_seguimiento")
private String guiaSeguimiento;

private Boolean eliminado = false;

private Timestamp creado_en;
private Timestamp actualizado_en;

@PrePersist
protected void onCreate() {
    this.creado_en = new Timestamp(System.currentTimeMillis());
    this.actualizado_en = this.creado_en;
}

@PreUpdate
protected void onUpdate() {
    this.actualizado_en = new Timestamp(System.currentTimeMillis());
}

// Getters & Setters
public Long getId() { return id; }
public void setId(Long id) { this.id = id; }

public Long getIdDespacho() { return idDespacho; }
public void setIdDespacho(Long idDespacho) { this.idDespacho = idDespacho; }

public EstadoEnvio getEstado() { return estado; }
public void setEstado(EstadoEnvio estado) { this.estado = estado; }

public String getTransportista() { return transportista; }
public void setTransportista(String transportista) { this.transportista = transportista; }

public String getGuiaSeguimiento() { return guiaSeguimiento; }
public void setGuiaSeguimiento(String guiaSeguimiento) { this.guiaSeguimiento = guiaSeguimiento; }

public Boolean getEliminado() { return eliminado; }
public void setEliminado(Boolean eliminado) { this.eliminado = eliminado; }

public Timestamp getCreado_en() { return creado_en; }
public void setCreado_en(Timestamp creado_en) { this.creado_en = creado_en; }

public Timestamp getActualizado_en() { return actualizado_en; }
public void setActualizado_en(Timestamp actualizado_en) { this.actualizado_en = actualizado_en; }


}