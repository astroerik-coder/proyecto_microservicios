-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-06-2025 a las 21:02:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pedidos_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_pedido`
--

CREATE TABLE `eventos_pedido` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `evento` varchar(100) DEFAULT NULL,
  `detalle` text DEFAULT NULL,
  `fecha_evento` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('Recibido','Procesando','Listo para envío','Enviado','Cancelado') DEFAULT 'Recibido',
  `total` decimal(10,2) DEFAULT 0.00,
  `eliminado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `id_cliente`, `fecha_pedido`, `estado`, `total`, `eliminado`) VALUES
(1, 1, '2025-06-21 01:32:43', 'Cancelado', 45.50, 1),
(2, 1, '2025-06-21 17:20:21', 'Recibido', 45.50, 0),
(3, 2, '2025-06-21 17:20:51', 'Recibido', 45.50, 0),
(4, 2, '2025-06-21 17:21:08', 'Recibido', 45.50, 0),
(5, 2, '2025-06-21 17:24:38', 'Recibido', 45.50, 0),
(6, 2, '2025-06-21 17:25:24', 'Recibido', 45.50, 0),
(7, 2, '2025-06-21 17:26:40', 'Recibido', 45.50, 0),
(8, 3, '2025-06-21 17:29:01', 'Recibido', 45.50, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` bigint(20) NOT NULL,
  `actualizado_en` datetime DEFAULT NULL,
  `creado_en` datetime DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `eliminado` bit(1) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `actualizado_en`, `creado_en`, `descripcion`, `eliminado`, `nombre`, `precio`, `stock`) VALUES
(1, '2025-06-21 14:01:59', '2025-06-21 14:01:59', 'Camisa de algodón manga larga', b'0', 'Camisa blanca', 15.99, 100);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `eventos_pedido`
--
ALTER TABLE `eventos_pedido`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_id_cliente` (`id_cliente`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `eventos_pedido`
--
ALTER TABLE `eventos_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
