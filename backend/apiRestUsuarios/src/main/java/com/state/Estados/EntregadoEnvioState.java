package com.state.Estados;

import com.example.demo.models.Envio;
import com.state.EstadoEnvioState;

public class EntregadoEnvioState implements EstadoEnvioState {
    @Override
    public boolean avanzar(Envio envio) {
        System.out.println("✅ El envío ya fue entregado. No puede avanzar.");
        return false;
    }

    @Override
    public boolean cancelar(Envio envio) {
        System.out.println("❌ No se puede cancelar un envío entregado.");
        return false;
    }

    @Override
    public boolean devolver(Envio envio) {
        System.out.println("⚠️ No se puede devolver un envío entregado.");
        return false;
    }

}
