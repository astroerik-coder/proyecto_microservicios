package com.state.Estados;

import com.example.demo.models.Envio;
import com.state.EstadoEnvioState;

public class CanceladoEnvioState implements EstadoEnvioState {
    @Override
    public boolean avanzar(Envio envio) {
        System.out.println("🚫 El envío está cancelado y no puede avanzar.");
        return false;
    }

    @Override
    public boolean cancelar(Envio envio) {
        System.out.println("ℹ️ El envío ya estaba cancelado.");
        return false;
    }

    @Override
    public boolean devolver(Envio envio) {
        System.out.println("❌ No se puede devolver un envío cancelado.");
        return false;
    }

}
