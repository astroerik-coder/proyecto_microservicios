package com.state;


import com.example.demo.models.Envio;

public interface EstadoEnvioState {
    boolean avanzar(Envio envio);   // Para avanzar de estado
    boolean cancelar(Envio envio);  // Para marcar como cancelado
    boolean devolver(Envio envio);  // Para marcar como devuelto
}
