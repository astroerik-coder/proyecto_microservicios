package com.state.Estados;

import com.example.demo.models.Envio;
import com.state.EstadoEnvioState;

public class DevueltoEnvioState implements EstadoEnvioState {
    @Override
    public boolean avanzar(Envio envio) {
        System.out.println("🔁 Un envío devuelto no puede avanzar.");
        return false;
    }

    @Override
    public boolean cancelar(Envio envio) {
        System.out.println("❌ Un envío devuelto no puede ser cancelado.");
        return false;
    }

    @Override
    public boolean devolver(Envio envio) {
        System.out.println("ℹ️ El envío ya fue devuelto.");
        return false;
    }

}
