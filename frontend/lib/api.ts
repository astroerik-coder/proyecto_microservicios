// API de Autenticación
const API_AUTH = process.env.API_MICRO_AUTH ?? "http://localhost:8080/api";
// API de Pedidos
const API_PEDIDOS =
  process.env.API_MICRO_PEDIDOS ?? "http://localhost:8082/api";
// API de Despacho
const API_DESPACHO =
  process.env.API_MICRO_DESPACHO ?? "http://localhost:8083/api";
// API de Inventario
const API_INVENTORY =
  process.env.API_MICRO_INVENTORY ?? "http://localhost:8084/api";
//API DE DETALLE DE PEDIDO
const API_DETALLE_PEDIDO =
  process.env.API_MICRO_DETALLE_PEDIDO ?? "http://localhost:8085/api";
// API de Cobros
const API_COBROS = process.env.API_MICRO_COBROS ?? "http://localhost:8086/api";
//API de despachos
const API_DESPACHOS =
  process.env.API_MICRO_DESPACHOS ?? "http://localhost:8087/api";
//API DE envios
const API_ENVIOS = process.env.API_MICRO_ENVIOS ?? "http://localhost:8088/api";

// Configuración de headers para las peticiones
const getHeaders = () => {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

//✅Login y Register
export const authAPI = {
  // Login
  login: async (credentials: { nombreUsuario: string; contraseña: string }) => {
    const response = await fetch(`${API_AUTH}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return response;
  },

  // Registro como CLIENTE
  register: async (data: {
    nombreUsuario: string;
    correo: string;
    contraseña: string;
    rol: string;
  }) => {
    const response = await fetch(`${API_AUTH}/auth/registro`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response;
  },
  // Perfil
  perfil: async () => {
    const response = await fetch(`${API_AUTH}/auth/perfil`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Logout (opcional)
  logout: async () => {
    const response = await fetch(`${API_AUTH}/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },
};

// ✅Inventario
export const inventarioAPI = {
  // Insertar producto
  insertInventory: async (inventaryData: any) => {
    const response = await fetch(`${API_INVENTORY}/productos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(inventaryData),
    });
    const data = await response.json();
    return data;
  },

  // Obtener inventario paginado
  getInventory: async (page: number = 0, size: number = 5) => {
    const response = await fetch(
      `${API_INVENTORY}/productos?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }

    const data = await response.json();
    return data; // incluye { content, totalPages, number, size, totalElements, etc. }
  },

  //Obtener por id
  getInventoryByID: async (productId: string) => {
    const response = await fetch(`${API_INVENTORY}/productos/${productId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await response.json();
    return data;
  },

  //Actualizar por ID
  updateInventoryByID: async (productId: string, inventaryData: any) => {
    const response = await fetch(`${API_INVENTORY}/productos/${productId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(inventaryData),
    });

    if (!response.ok) {
      const error = await response.text(); // o .json() si es JSON
      throw new Error(`Error ${response.status}: ${error}`);
    }
    return response.json();
  },

  //Eliminado logico
  deleteInventoryByID: async (productId: string) => {
    const response = await fetch(`${API_INVENTORY}/productos/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await response.json();
    return data;
  },
};

// ✅Pedidos
export const pedidosAPI = {
  // Crear nuevo pedido
  createPedido: async (pedidoData: {
    idCliente: number;
    total: number;
    lineas: Array<{
      idProducto: number;
      cantidad: number;
      precioUnitario: number;
    }>;
  }) => {
    const response = await fetch(`${API_PEDIDOS}/pedidos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(pedidoData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al crear pedido: ${error}`);
    }

    return response.json();
  },

  // Obtener pedido por ID
  getPedidoById: async (pedidoId: number) => {
    const response = await fetch(`${API_PEDIDOS}/pedidos/${pedidoId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener pedido: ${response.status}`);
    }

    return response.json();
  },

  // Obtener pedidos de un cliente
  getPedidosByCliente: async (clienteId: number) => {
    const response = await fetch(
      `${API_PEDIDOS}/pedidos/cliente/${clienteId}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al obtener pedidos del cliente: ${response.status}`
      );
    }

    const data = await response.json();
    // Manejar respuesta paginada
    return data.content || data;
  },

  // Obtener todos los pedidos (para admin)
  getAllPedidos: async () => {
    const response = await fetch(`${API_PEDIDOS}/pedidos`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener todos los pedidos: ${response.status}`);
    }

    const data = await response.json();
    // Manejar respuesta paginada
    return data.content || data;
  },

  // Eliminar pedido (eliminado lógico)
  deletePedido: async (pedidoId: number) => {
    const response = await fetch(`${API_PEDIDOS}/pedidos/${pedidoId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al eliminar pedido: ${error}`);
    }

    return response.json();
  },

  // Actualizar estado del pedido (solo para ADMIN)
  updatePedidoEstado: async (pedidoId: number, estado: string) => {
    const response = await fetch(`${API_PEDIDOS}/pedidos/${pedidoId}/estado`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al actualizar estado: ${error}`);
    }

    return response.json();
  },

  // Aprobar pedido (cambiar de PENDIENTE_APROBACION a Procesando)
  approvePedido: async (pedidoId: number) => {
    const response = await fetch(`${API_PEDIDOS}/pedidos/${pedidoId}/aprobar`, {
      method: "PUT",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al aprobar pedido: ${error}`);
    }

    return response.json();
  },
};

// Despachos
export const despachosAPI = {
  // Obtener todos los despachos
  obtenerTodos: async () => {
    const response = await fetch(`${API_DESPACHOS}/despachos`);
    return await response.json();
  },

  // Crear un nuevo despacho
  crearDespacho: async (despachoData: any) => {
    const response = await fetch(`${API_DESPACHOS}/despachos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(despachoData),
    });
    return await response.json();
  },

  // Obtener un despacho por ID
  obtenerPorId: async (id: any) => {
    const response = await fetch(`${API_DESPACHOS}/despachos/${id}`);
    return await response.json();
  },

  // Eliminar un despacho
  eliminarDespacho: async (id: any) => {
    const response = await fetch(`${API_DESPACHOS}/despachos/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  },

  // Obtener despachos por ID de pedido
  obtenerPorPedido: async (idPedido: any) => {
    const response = await fetch(
      `${API_DESPACHOS}/despachos/pedido/${idPedido}`
    );
    return await response.json();
  },

  // Avanzar estado del despacho
  avanzarEstado: async (idDespacho: any) => {
    const response = await fetch(
      `${API_DESPACHOS}/despachos/${idDespacho}/avanzar`,
      {
        method: "POST",
      }
    );
    return await response.json();
  },

  // Marcar despacho como fallido
  marcarFallido: async (idDespacho: any) => {
    const response = await fetch(
      `${API_DESPACHOS}/despachos/${idDespacho}/fallar`,
      {
        method: "POST",
      }
    );
    return await response.json();
  },

  // Reiniciar despacho
  reiniciarDespacho: async (idDespacho: any) => {
    const response = await fetch(
      `${API_DESPACHOS}/despachos/${idDespacho}/reiniciar`,
      {
        method: "POST",
      }
    );
    return await response.json();
  },
};

// API de Cobros
export const cobrosAPI = {
  // Crear cobro
  createCobro: async (cobroData: {
    idPedido: number;
    monto: number;
    metodoPago: string;
    referenciaPago: string;
    datosPago?: any;
  }) => {
    const response = await fetch(`${API_COBROS}/cobros`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(cobroData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al crear cobro: ${error}`);
    }

    return response.json();
  },

  // Obtener cobro por ID
  getCobroById: async (cobroId: number) => {
    const response = await fetch(`${API_COBROS}/cobros/${cobroId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener cobro: ${response.status}`);
    }

    return response.json();
  },

  // Obtener cobro por ID de pedido
  getCobroByPedidoId: async (pedidoId: number) => {
    const response = await fetch(`${API_COBROS}/cobros/pedido/${pedidoId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener cobro del pedido: ${response.status}`);
    }

    return response.json();
  },

  // Procesar cobro
  procesarCobro: async (cobroId: number) => {
    const response = await fetch(`${API_COBROS}/cobros/${cobroId}/procesar`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al procesar cobro: ${error}`);
    }

    return response.json();
  },

  // Marcar cobro como fallido
  marcarCobroFallido: async (cobroId: number) => {
    const response = await fetch(`${API_COBROS}/cobros/${cobroId}/fallar`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al marcar cobro como fallido: ${error}`);
    }

    return response.json();
  },

  // Obtener todos los cobros
  getAllCobros: async () => {
    const response = await fetch(`${API_COBROS}/cobros`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener cobros: ${response.status}`);
    }

    return response.json();
  },
};
