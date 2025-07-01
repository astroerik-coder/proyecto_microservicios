-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-07-2025 a las 00:20:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

USE despachos_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `despachos_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `despachos`
--

CREATE TABLE `despachos` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `fecha_despacho` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('PENDIENTE','EN_PREPARACION','LISTO_PARA_ENVIO','FALLIDO') DEFAULT 'PENDIENTE',
  `observaciones` text DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `despachos`
--

INSERT INTO `despachos` (`id`, `id_pedido`, `fecha_despacho`, `estado`, `observaciones`, `eliminado`, `creado_en`, `actualizado_en`) VALUES
(9, 3, '2025-06-21 15:52:39', 'LISTO_PARA_ENVIO', 'Entregar rápido', 0, '2025-06-21 15:52:39', '2025-06-21 15:54:40'),
(10, 3, '2025-06-21 15:55:05', 'PENDIENTE', 'Entregar rápido', 0, '2025-06-21 15:55:05', '2025-06-21 15:59:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envios`
--

CREATE TABLE `envios` (
  `id` bigint(20) NOT NULL,
  `actualizado_en` datetime DEFAULT NULL,
  `creado_en` datetime DEFAULT NULL,
  `eliminado` bit(1) DEFAULT NULL,
  `estado` varchar(255) NOT NULL,
  `guia_seguimiento` varchar(255) DEFAULT NULL,
  `id_pedido` bigint(20) NOT NULL,
  `transportista` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_despacho`
--

CREATE TABLE `eventos_despacho` (
  `id` int(11) NOT NULL,
  `id_despacho` int(11) NOT NULL,
  `evento` varchar(100) DEFAULT NULL,
  `detalle` text DEFAULT NULL,
  `fecha_evento` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `despachos`
--
ALTER TABLE `despachos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_id_pedido` (`id_pedido`);

--
-- Indices de la tabla `envios`
--
ALTER TABLE `envios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eventos_despacho`
--
ALTER TABLE `eventos_despacho`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `despachos`
--
ALTER TABLE `despachos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `envios`
--
ALTER TABLE `envios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `eventos_despacho`
--
ALTER TABLE `eventos_despacho`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
