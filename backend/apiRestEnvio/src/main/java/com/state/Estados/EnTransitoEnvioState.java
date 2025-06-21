package com.state.Estados;

import com.example.demo.models.Envio;
import com.example.demo.models.EstadoEnvio;
import com.state.EstadoEnvioState;

public class EnTransitoEnvioState implements EstadoEnvioState {
    @Override
    public boolean avanzar(Envio envio) {
        envio.setEstado(EstadoEnvio.ENTREGADO);
        System.out.println("📦 Envío entregado exitosamente.");
        return true;
    }

    @Override
    public boolean cancelar(Envio envio) {
        envio.setEstado(EstadoEnvio.CANCELADO);
        System.out.println("❌ Envío cancelado mientras estaba en tránsito.");
        return true;
    }

    @Override
    public boolean devolver(Envio envio) {
        envio.setEstado(EstadoEnvio.DEVUELTO);
        System.out.println("↩️ Envío devuelto mientras estaba en tránsito.");
        return true;
    }

}
