package com.state.Estados;

import com.example.demo.models.Despacho;
import com.example.demo.models.EstadoDespacho;
import com.state.EstadoDespachoState;

public class EnPreparacionState implements EstadoDespachoState {
    @Override
    public boolean avanzar(Despacho d) {
        d.setEstado(EstadoDespacho.LISTO_PARA_ENVIO);
        System.out.println("✅ Despacho listo para envío.");
        return true;
    }

    @Override
    public boolean fallar(Despacho d) {
        d.setEstado(EstadoDespacho.FALLIDO);
        System.out.println("❌ Despacho falló durante preparación.");
        return true;
    }

    @Override
    public boolean reiniciar(Despacho d) {
        System.out.println("❌ No se puede reiniciar desde EN_PREPARACION.");
        return false;
    }
}