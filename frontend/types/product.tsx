export interface Product {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
  eliminado: boolean;
  descripcion?: string;
  creado_en?: string;
  actualizado_en?: string;
}

export interface DetallePedido {
  id: number;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  eliminado: boolean;
  creado_en: string;
  actualizado_en: string;
}

export interface Pedido {
  id: number;
  idCliente: number;
  fechaPedido: string;
  estado:
    | "PENDIENTE_APROBACION"
    | "Cancelado"
    | "Enviado"
    | "Listo para despachar"
    | "Listo para pagar"
    | "Procesando"
    | "Recibido";
  total: number;
  eliminado: boolean;
  detalles: DetallePedido[];
  actualizado_en?: string;
}

export interface LineaPedido {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface PedidoRequest {
  idCliente: number;
  total: number;
  lineas: LineaPedido[];
}

export interface Despacho {
  id: number;
  idPedido: number;
  estado:
    | "PENDIENTE"
    | "EN_PROCESO"
    | "LISTO_PARA_ENVIO"
    | "ENVIADO"
    | "ENTREGADO";
  observacion: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Cobro {
  id: number;
  idPedido: number;
  monto: number;
  metodoPago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  estado: "PENDIENTE" | "PAGADO" | "FALLIDO";
  referenciaPago: string;
  datosPago: any;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface PedidoCompleto extends Pedido {
  despacho?: Despacho;
  cobro?: Cobro;
}
