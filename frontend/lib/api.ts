// Simulación de API para conectar con microservicios Spring Boot
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
const API_INVENTORY =
  process.env.API_MICRO_INVENTORY ?? "http://localhost:8084/api";

// Configuración de headers para las peticiones
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// Servicio de Órdenes
export const ordersAPI = {
  // Crear nueva orden
  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  // Obtener todas las órdenes
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Actualizar estado de orden
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // Obtener orden por ID
  getOrderById: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Servicio de Inventario
export const inventoryAPI = {
  // Obtener inventario completo
  getInventory: async () => {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Disminuir stock
  decreaseStock: async (productId: string, quantity: number) => {
    const response = await fetch(
      `${API_BASE_URL}/inventory/${productId}/decrease`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      }
    );
    return response.json();
  },

  // Liberar stock (vía MuleSoft para excepciones)
  releaseStock: async (productId: string, quantity: number) => {
    const response = await fetch(
      `${API_BASE_URL}/inventory/${productId}/release`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      }
    );
    return response.json();
  },
};

// Servicio de Despacho
export const dispatchAPI = {
  // Cambiar estado de despacho
  updateDispatchStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/dispatch/${orderId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // Marcar como listo para envío
  markReadyToShip: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/dispatch/${orderId}/ready`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Servicio de Cobros
export const paymentsAPI = {
  // Simular pago
  processPayment: async (paymentData: any) => {
    const response = await fetch(`${API_BASE_URL}/payments/process`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  // Obtener estado de pago
  getPaymentStatus: async (paymentId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/payments/${paymentId}/status`,
      {
        headers: getHeaders(),
      }
    );
    return response.json();
  },
};

// Servicio de Envío
export const shippingAPI = {
  // Actualizar estado de envío
  updateShippingStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/shipping/${orderId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // Obtener información de envío
  getShippingInfo: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/shipping/${orderId}`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Servicio de Autenticación
export const authAPI = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Verificar token
  verifyToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Utilidades para manejo de errores
export const handleAPIError = (error: any) => {
  console.error("API Error:", error);

  if (error.status === 401) {
    // Token expirado o inválido
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return {
    success: false,
    message: error.message || "Error en la comunicación con el servidor",
  };
};

// Interceptor para RabbitMQ events (simulado)
export const rabbitMQEvents = {
  // Suscribirse a eventos de órdenes
  subscribeToOrderEvents: (callback: (event: any) => void) => {
    // Simulación de WebSocket o Server-Sent Events
    const eventSource = new EventSource(`${API_BASE_URL}/events/orders`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    return eventSource;
  },

  // Suscribirse a eventos de inventario
  subscribeToInventoryEvents: (callback: (event: any) => void) => {
    const eventSource = new EventSource(`${API_BASE_URL}/events/inventory`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    return eventSource;
  },

  // Suscribirse a eventos de pagos
  subscribeToPaymentEvents: (callback: (event: any) => void) => {
    const eventSource = new EventSource(`${API_BASE_URL}/events/payments`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    return eventSource;
  },
};

//Inventario
export const inventarioAPI = {
  // Obtener inventario completo
  getInventory: async () => {
    const response = await fetch(`${API_INVENTORY}/productos`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await response.json();
    console.log("Productos obtenidos:", data);
    return data;
  },

  //Obtener por id
  getInventoryByID: async (productId: string) => {
    const response = await fetch(`${API_INVENTORY}/productos/${productId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await response.json();
    console.log("Producto obtenido:", data);
    return data;
  },

  //Actualizar por ID
  updateInventoryByID: async (productId: string) => {
    const response = await fetch(`${API_INVENTORY}/productos/${productId}`, {
      method: "PUT",
      headers: getHeaders(),
    });
    const data = await response.json();
    console.log("Producto actualizado:", data);
    return data;
  },

  //Eliminado logico
  deleteInventoryByID: async (productId: string) => {
    const response = await fetch(`${API_INVENTORY}/productos/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await response.json();
    console.log("Producto eliminado:", data);
    return data;
  },
};
