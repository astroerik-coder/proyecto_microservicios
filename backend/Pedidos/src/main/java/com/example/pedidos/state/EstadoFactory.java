package com.example.pedidos.state;

import com.example.pedidos.models.Pedido;
import com.example.pedidos.state.estados.*;

public class EstadoFactory {

    public static EstadoPedidoState getEstado(Pedido pedido) {
        switch (pedido.getEstado()) {
            case "Recibido":
                return new EstadoRecibido();
            case "Procesando":
                return new EstadoProcesando();
            case "Listo para despachar":
                return new EstadoListoParaDespachar();
            case "Listo para pagar":
                return new EstadoListoParaPagar();
            case "Enviado":
                return new EstadoEnviado();
            case "Cancelado":
                return new EstadoCancelado();
            default:
                throw new IllegalStateException("Estado desconocido: " + pedido.getEstado());
        }

    }

}