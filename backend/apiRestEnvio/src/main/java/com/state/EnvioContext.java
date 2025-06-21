package com.state;

import com.example.demo.models.Envio;
import com.state.Estados.CanceladoEnvioState;
import com.state.Estados.DevueltoEnvioState;
import com.state.Estados.EnTransitoEnvioState;
import com.state.Estados.EntregadoEnvioState;

public class EnvioContext {
    private EstadoEnvioState estado;

    public EnvioContext(Envio envio) {
        switch (envio.getEstado()) {
            case EN_TRANSITO:
                estado = new EnTransitoEnvioState();
                break;
            case ENTREGADO:
                estado = new EntregadoEnvioState();
                break;
            case DEVUELTO:
                estado = new DevueltoEnvioState();
                break;
            case CANCELADO:
                estado = new CanceladoEnvioState();
                break;
            default:
                throw new IllegalArgumentException("Estado desconocido: " + envio.getEstado());
        }
    }

    public boolean avanzar(Envio envio) {
        return estado.avanzar(envio);
    }

    public boolean cancelar(Envio envio) {
        return estado.cancelar(envio);
    }

    public boolean devolver(Envio envio) {
        return estado.devolver(envio);
    }
}
