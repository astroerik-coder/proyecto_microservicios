-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-07-2025 a las 00:21:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

USE envios_db;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `envios_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envios`
--

CREATE TABLE `envios` (
  `id` int(11) NOT NULL,
  `id_despacho` int(11) NOT NULL,
  `estado` enum('EN_TRANSITO','ENTREGADO','DEVUELTO','CANCELADO') DEFAULT 'EN_TRANSITO',
  `transportista` varchar(100) DEFAULT NULL,
  `tracking_code` varchar(100) DEFAULT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` timestamp NULL DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0,
  `actualizado_en` datetime DEFAULT NULL,
  `creado_en` datetime DEFAULT NULL,
  `guia_seguimiento` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envios`
--

INSERT INTO `envios` (`id`, `id_despacho`, `estado`, `transportista`, `tracking_code`, `fecha_envio`, `fecha_entrega`, `observaciones`, `eliminado`, `actualizado_en`, `creado_en`, `guia_seguimiento`) VALUES
(1, 2, 'ENTREGADO', 'DHL', NULL, '2025-06-21 16:55:20', NULL, NULL, 0, '2025-06-21 11:59:46', '2025-06-21 11:55:20', 'DHL12345678'),
(2, 2, 'EN_TRANSITO', 'DHL', NULL, '2025-06-21 16:59:00', NULL, NULL, 1, '2025-06-21 11:59:15', '2025-06-21 11:59:00', 'DHL12345678'),
(3, 2, 'DEVUELTO', 'DHL', NULL, '2025-06-21 17:00:52', NULL, NULL, 0, '2025-06-21 12:01:04', '2025-06-21 12:00:52', 'DHL12345678'),
(4, 2, 'CANCELADO', 'DHL', NULL, '2025-06-21 17:01:39', NULL, NULL, 0, '2025-06-21 12:01:44', '2025-06-21 12:01:39', 'DHL12345678');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `envios`
--
ALTER TABLE `envios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `envios`
--
ALTER TABLE `envios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
