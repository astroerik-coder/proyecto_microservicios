# Gestión de Despachos

Este módulo proporciona una interfaz completa para la gestión y seguimiento de despachos en el sistema de gestión de pedidos.

## Características

### 🚀 Funcionalidades Principales

- **Gestión Completa de Despachos**: Crear, editar, eliminar y gestionar el estado de despachos
- **Seguimiento Visual**: Monitoreo en tiempo real con diseño moderno y actualizaciones automáticas
- **Estados de Despacho**: Control completo sobre los estados PENDIENTE, EN_PREPARACION, LISTO_PARA_ENVIO, FALLIDO
- **Acciones Rápidas**: Botones para avanzar estado, marcar como fallido y reiniciar despachos
- **Validación de Formularios**: Validación en tiempo real con mensajes de error claros
- **Notificaciones**: Sistema de toast para feedback inmediato al usuario

### 📊 Estados de Despacho

1. **PENDIENTE** - Despacho creado, esperando procesamiento
2. **EN_PREPARACION** - Despacho en proceso de preparación
3. **LISTO_PARA_ENVIO** - Despacho listo para ser enviado
4. **FALLIDO** - Despacho marcado como fallido (requiere reinicio)

### 🔧 Componentes

#### `DespachosDashboard`
- Tabla completa de despachos con todas las acciones
- Estadísticas en tiempo real
- Formulario para crear nuevos despachos
- Filtros y búsqueda

#### `DespachoTracking`
- Vista visual por estados
- Actualizaciones automáticas cada 30 segundos
- Timeline de progreso
- Acciones rápidas integradas

#### `CrearDespachoForm`
- Formulario validado para crear despachos
- Contador de caracteres para observaciones
- Feedback visual del estado inicial

#### `DespachoActions`
- Componente reutilizable para acciones de despacho
- Confirmaciones antes de acciones críticas
- Estados de carga para mejor UX

#### `DespachosNav`
- Navegación entre páginas de despachos
- Indicador de página activa
- Enlaces de regreso al dashboard principal

### 🛠️ API Endpoints Utilizados

```typescript
// Obtener todos los despachos
GET /api/despachos

// Crear nuevo despacho
POST /api/despachos
{
  "idPedido": 18,
  "observaciones": "Entregar rápido"
}

// Obtener despacho por ID
GET /api/despachos/{id}

// Eliminar despacho
DELETE /api/despachos/{id}

// Avanzar estado del despacho
POST /api/despachos/{id}/avanzar

// Marcar despacho como fallido
POST /api/despachos/{id}/fallar

// Reiniciar despacho
POST /api/despachos/{id}/reiniciar
```

### 🎨 Diseño y UX

- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Tema Oscuro/Claro**: Soporte completo para ambos temas
- **Iconografía**: Iconos de Lucide React para mejor comprensión visual
- **Colores por Estado**: Sistema de colores consistente para cada estado
- **Animaciones**: Transiciones suaves y estados de carga
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

### 📱 Páginas Disponibles

1. **`/admin/despachos`** - Gestión completa de despachos
2. **`/admin/despachos/tracking`** - Seguimiento visual en tiempo real

### 🔄 Flujo de Trabajo

1. **Crear Despacho**: Se crea con estado PENDIENTE
2. **Avanzar Estado**: Cambia secuencialmente PENDIENTE → EN_PREPARACION → LISTO_PARA_ENVIO
3. **Marcar Fallido**: Cambia a estado FALLIDO (requiere reinicio)
4. **Reiniciar**: Vuelve al estado PENDIENTE desde FALLIDO

### 🚨 Manejo de Errores

- Validación de formularios en tiempo real
- Mensajes de error específicos
- Estados de carga para evitar acciones duplicadas
- Confirmaciones para acciones críticas
- Toast notifications para feedback inmediato

### 🔧 Configuración

El módulo utiliza las siguientes variables de entorno:
- `API_MICRO_DESPACHOS`: URL del microservicio de despachos (default: http://localhost:8087/api)

### 📈 Estadísticas

El dashboard muestra estadísticas en tiempo real:
- Total de despachos
- Despachos por estado
- Progreso general del sistema

### 🎯 Próximas Mejoras

- [ ] Filtros avanzados por fecha y estado
- [ ] Exportación de datos a CSV/PDF
- [ ] Notificaciones push para cambios de estado
- [ ] Integración con sistema de mensajería
- [ ] Dashboard de métricas avanzadas
- [ ] Historial de cambios de estado 