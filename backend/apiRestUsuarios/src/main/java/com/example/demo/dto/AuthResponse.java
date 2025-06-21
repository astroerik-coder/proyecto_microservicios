package com.example.demo.dto;

public class AuthResponse {
    private String token;
    private String nombreUsuario;
    private String rol;

    public AuthResponse(String token, String nombreUsuario, String rol) {
        this.token = token;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public String getRol() {
        return rol;
    }
}