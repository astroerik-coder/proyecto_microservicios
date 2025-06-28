-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-06-2025 a las 05:56:31
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
-- Base de datos: `autenticacion_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `contraseña_hash` text NOT NULL,
  `rol` varchar(50) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `imagen_url` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `correo`, `contraseña_hash`, `rol`, `activo`, `telefono`, `direccion`, `cedula`, `genero`, `imagen_url`, `creado_en`) VALUES
(1, 'cliente_actualizado', 'nuevo@email.com', '$2a$10$RmfZByhQ.7OjhPkHEMfr2e/wbcn.SRZwiueuQO4S0uy2mV6JSJlga', 'CLIENTE', 1, '098888888', 'Nueva dirección', '0987654321', 'Masculino', 'https://img.com/usuario.jpg', '2025-06-27 17:21:27'),
(2, 'cliente1', 'cliente@demo.com', '$2a$10$n3YhjC.dhyfa/vpqz2Clt.pNZW1HreizuqXJprVbRg436FFZ2hb9K', 'CLIENTE', 1, NULL, NULL, NULL, NULL, NULL, '2025-06-27 17:24:12'),
(3, 'cliente2', 'cliente2@demo.com', '$2a$10$cjr48kmOC.eppgnb3wq0AeaGOEdkvNjhbJnozwjiyRWiOjo5Pn/Zi', 'CLIENTE', 1, '099999999', 'Av. Central 123', '1723456789', 'Masculino', 'https://ejemplo.com/foto.jpg', '2025-06-27 17:28:01');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
