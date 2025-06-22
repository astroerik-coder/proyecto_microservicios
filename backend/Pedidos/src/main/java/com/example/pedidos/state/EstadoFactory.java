package com.example.pedidos.state;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.state.estados.*;

public class EstadoFactory {

    public static EstadoPedidoState getEstado(Pedido pedido) {
        switch (pedido.getEstado()) {
            case "Procesando":
                return new EstadoProcesando();
            case "Listo para envío":
                return new EstadoListoParaEnvio();
            case "Enviado":
                return new EstadoEnviado();
            case "Cancelado":
                return new EstadoCancelado();
            default:
                return new EstadoRecibido();
        }
    }
}