package com.state.Estados;

import com.example.despachos.models.Despacho;
import com.example.despachos.models.EstadoDespacho;
import com.state.EstadoDespachoState;

public class FallidoState implements EstadoDespachoState {
    @Override
    public boolean avanzar(Despacho d) {
        System.out.println("🚫 Despacho fallido no puede avanzar.");
        return false;
    }

    @Override
    public boolean fallar(Despacho d) {
        System.out.println("ℹ️ Ya está en estado FALLIDO.");
        return false;
    }

    @Override
    public boolean reiniciar(Despacho d) {
        d.setEstado(EstadoDespacho.PENDIENTE);
        System.out.println("🔁 Despacho reiniciado a PENDIENTE.");
        return true;
    }
}