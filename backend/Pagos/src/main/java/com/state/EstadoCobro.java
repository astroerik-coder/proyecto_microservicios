package com.state;

import com.example.pagos.models.Cobro;

public interface EstadoCobro {
    void procesarPago(Cobro cobro);
    void marcarFallido(Cobro cobro);
    void reintentar(Cobro cobro);
}
