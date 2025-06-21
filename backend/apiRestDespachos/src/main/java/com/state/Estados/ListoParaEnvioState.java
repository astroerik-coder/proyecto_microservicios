package com.state.Estados;

import com.example.demo.models.Despacho;
import com.state.EstadoDespachoState;

public class ListoParaEnvioState implements EstadoDespachoState {
    @Override
    public boolean avanzar(Despacho d) {
        System.out.println("ℹ️ Ya está LISTO_PARA_ENVIO. No se puede avanzar.");
        return false;
    }

    @Override
    public boolean fallar(Despacho d) {
        System.out.println("⚠️ No se debe fallar en LISTO_PARA_ENVIO. Control de calidad externo.");
        return false;
    }

    @Override
    public boolean reiniciar(Despacho d) {
        System.out.println("🚫 No se puede reiniciar desde LISTO_PARA_ENVIO.");
        return false;
    }
}