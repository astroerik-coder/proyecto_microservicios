package com.state;

import com.example.demo.models.Despacho;

public interface EstadoDespachoState {
    boolean avanzar(Despacho despacho);

    boolean fallar(Despacho despacho);

    boolean reiniciar(Despacho despacho);
}