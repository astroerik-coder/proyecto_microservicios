package com.state;

import com.example.despachos.models.Despacho;
import com.state.Estados.EnPreparacionState;
import com.state.Estados.FallidoState;
import com.state.Estados.ListoParaEnvioState;
import com.state.Estados.PendienteState;

public class DespachoContext {
    private EstadoDespachoState estado;

    public DespachoContext(Despacho d) {
        switch (d.getEstado()) {
            case PENDIENTE:
                estado = new PendienteState();
                break;
            case EN_PREPARACION:
                estado = new EnPreparacionState();
                break;
            case LISTO_PARA_ENVIO:
                estado = new ListoParaEnvioState();
                break;
            case FALLIDO:
                estado = new FallidoState();
                break;
        }
    }

    public boolean avanzar(Despacho d) {
        return estado.avanzar(d);
    }

    public boolean fallar(Despacho d) {
        return estado.fallar(d);
    }

    public boolean reiniciar(Despacho d) {
        return estado.reiniciar(d);
    }
}
