package com.state;

import com.example.demo.models.Cobro;

public interface EstadoCobro {
    void procesarPago(Cobro cobro);
    void marcarFallido(Cobro cobro);
    void reintentar(Cobro cobro);
}
