package com.state.Estados;

import com.example.pagos.models.Cobro;
import com.state.EstadoCobro;
import com.state.EstadoPago;

public class EstadoFallido implements EstadoCobro {

    @Override
    public void procesarPago(Cobro cobro) {
        cobro.setEstadoPago(EstadoPago.PAGADO);
        System.out.println("✅ Reintento exitoso: Pago marcado como pagado.");
    }

    @Override
    public void marcarFallido(Cobro cobro) {
        System.out.println("ℹ️ Ya está fallido.");
    }

    @Override
    public void reintentar(Cobro cobro) {
        cobro.setEstadoPago(EstadoPago.PENDIENTE);
        System.out.println("🔄 Se reintentará el cobro. Estado cambiado a pendiente.");
    }
}