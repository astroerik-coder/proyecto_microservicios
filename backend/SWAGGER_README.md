# Documentación de Swagger para Microservicios

Este documento explica cómo acceder y usar la documentación de Swagger para los microservicios de Inventario y Pedidos.

## Configuración de Swagger

Se ha configurado Swagger/OpenAPI para ambos microservicios usando Springfox 2.9.2, que es compatible con Spring Boot 2.3.0.

### Dependencias Agregadas

Para ambos proyectos se agregaron las siguientes dependencias en el `pom.xml`:

```xml
<!-- Swagger/OpenAPI -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```

## Acceso a Swagger UI

### Microservicio de Inventario

Una vez que el microservicio esté ejecutándose, puedes acceder a la documentación de Swagger en:

```
http://localhost:8080/swagger-ui.html
```

**Endpoints documentados:**
- `GET /api/productos` - Listar todos los productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/buscar` - Buscar productos por nombre
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto
- `PUT /api/productos/{id}/disminuir-stock` - Disminuir stock
- `PUT /api/productos/{id}/liberar-stock` - Liberar stock

### Microservicio de Pedidos

Una vez que el microservicio esté ejecutándose, puedes acceder a la documentación de Swagger en:

```
http://localhost:8080/swagger-ui.html
```

**Endpoints documentados:**
- `GET /api/pedidos` - Listar todos los pedidos
- `GET /api/pedidos/{id}` - Obtener pedido por ID
- `POST /api/pedidos` - Crear nuevo pedido
- `PUT /api/pedidos/{id}/avanzar` - Avanzar estado del pedido
- `PUT /api/pedidos/{id}/cancelar` - Cancelar pedido
- `DELETE /api/pedidos/{id}` - Eliminar pedido

## Características de la Documentación

### Anotaciones Utilizadas

1. **@Api** - Documenta el controlador completo
2. **@ApiOperation** - Describe cada endpoint
3. **@ApiParam** - Documenta parámetros de entrada
4. **@ApiResponses** - Define códigos de respuesta
5. **@ApiModel** - Documenta modelos de datos
6. **@ApiModelProperty** - Documenta propiedades de los modelos

### Información de la API

- **Título:** API de Inventario / API de Pedidos
- **Descripción:** Documentación completa de los endpoints
- **Versión:** 1.0.0
- **Contacto:** Equipo de Desarrollo
- **Licencia:** MIT

## Ejecutar los Microservicios

### Inventario
```bash
cd backend/Inventario
./mvnw spring-boot:run
```

### Pedidos
```bash
cd backend/Pedidos
./mvnw spring-boot:run
```

## Notas Importantes

1. **Puertos:** Asegúrate de que los puertos no estén en conflicto. Si ambos microservicios usan el puerto 8080, modifica el `application.properties` de uno de ellos.

2. **Base de Datos:** Asegúrate de que las bases de datos estén configuradas y accesibles antes de ejecutar los microservicios.

3. **CORS:** Si necesitas acceder desde un frontend, asegúrate de que la configuración CORS esté habilitada.

## Personalización

Puedes personalizar la documentación modificando las clases `SwaggerConfig.java` en cada proyecto:

- Cambiar el título y descripción
- Agregar información de contacto
- Modificar la licencia
- Agregar más endpoints a la documentación

## Troubleshooting

Si Swagger no se carga correctamente:

1. Verifica que las dependencias estén en el `pom.xml`
2. Asegúrate de que la clase `SwaggerConfig` esté en el paquete correcto
3. Verifica que no haya errores de compilación
4. Revisa los logs del servidor para errores específicos 