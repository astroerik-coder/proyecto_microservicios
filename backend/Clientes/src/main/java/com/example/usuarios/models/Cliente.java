package com.example.usuarios.models;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombreUsuario", nullable = false)
    private String nombreUsuario;

    @Column(name = "correo", unique = true)
    private String correo;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "direccion", length = 200)
    private String direccion;

    @Column(name = "cedula", length = 20)
    private String cedula;

    @Column(name = "genero")
    private String genero;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }
}
