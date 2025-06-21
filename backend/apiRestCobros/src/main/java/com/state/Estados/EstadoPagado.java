package com.state.Estados;

import com.example.demo.models.Cobro;
import com.state.EstadoCobro;

public class EstadoPagado implements EstadoCobro {

    @Override
    public void procesarPago(Cobro cobro) {
        System.out.println("⚠️ El cobro ya fue procesado. No se puede volver a pagar.");
    }

    @Override
    public void marcarFallido(Cobro cobro) {
        System.out.println("❌ No puedes fallar un cobro ya pagado.");
    }

    @Override
    public void reintentar(Cobro cobro) {
        System.out.println("⛔ No se puede reintentar un cobro ya pagado.");
    }
}