package com.state.Estados;

import com.example.demo.models.Cobro;
import com.state.EstadoCobro;
import com.state.EstadoPago;

public class EstadoPendiente implements EstadoCobro {

    @Override
    public void procesarPago(Cobro cobro) {
        cobro.setEstadoPago(EstadoPago.PAGADO);
        System.out.println("✅ Pago procesado exitosamente.");
    }

    @Override
    public void marcarFallido(Cobro cobro) {
        cobro.setEstadoPago(EstadoPago.FALLIDO);
        System.out.println("⚠️ Pago marcado como fallido.");
    }

    @Override
    public void reintentar(Cobro cobro) {
        System.out.println("🔁 Ya está en estado pendiente.");
    }
}