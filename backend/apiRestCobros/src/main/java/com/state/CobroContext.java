package com.state;

import com.example.demo.models.Cobro;
import com.state.Estados.EstadoFallido;
import com.state.Estados.EstadoPagado;
import com.state.Estados.EstadoPendiente;

public class CobroContext {

    private EstadoCobro estadoActual;

    public CobroContext(Cobro cobro) {
        switch (cobro.getEstadoPago()) {
            case PENDIENTE:
                this.estadoActual = new EstadoPendiente();
                break;
            case PAGADO:
                this.estadoActual = new EstadoPagado();
                break;
            case FALLIDO:
                this.estadoActual = new EstadoFallido();
                break;
        }
    }

    public void procesarPago(Cobro cobro) {
        estadoActual.procesarPago(cobro);
    }

    public void marcarFallido(Cobro cobro) {
        estadoActual.marcarFallido(cobro);
    }

    public void reintentar(Cobro cobro) {
        estadoActual.reintentar(cobro);
    }
}