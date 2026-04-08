-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-04-2026 a las 06:36:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `psicomente_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autenticacion`
--

CREATE TABLE `autenticacion` (
  `id` int(11) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_reserva`
--

CREATE TABLE `detalle_reserva` (
  `id` int(11) NOT NULL,
  `reserva_id` int(11) NOT NULL,
  `servicio` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `duracion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `detalle_reserva`
--

INSERT INTO `detalle_reserva` (`id`, `reserva_id`, `servicio`, `descripcion`, `precio`, `duracion`) VALUES
(4, 1, 'Consulta individual', 'Sesión personalizada de terapia', 5000.00, 60),
(5, 1, 'Evaluación inicial', 'Primera entrevista diagnóstica', 7000.00, 90),
(6, 1, 'Seguimiento', 'Control y evolución del paciente', 4500.00, 45);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_reserva` date NOT NULL,
  `hora_reserva` time NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'PENDIENTE',
  `observaciones` text DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `usuario_id`, `fecha_reserva`, `hora_reserva`, `estado`, `observaciones`, `created_at`) VALUES
(1, 1, '2026-03-20', '00:18:30', 'PENDIENTE', 'qweqweqwe', '2026-03-20 05:48:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones_personalizadas`
--

CREATE TABLE `sesiones_personalizadas` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `texto` text NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `topicos`
--

CREATE TABLE `topicos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `resenia` text NOT NULL,
  `contenido` longtext NOT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `publicado` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `topicos`
--

INSERT INTO `topicos` (`id`, `titulo`, `resenia`, `contenido`, `imagen_url`, `slug`, `publicado`, `created_at`, `updated_at`) VALUES
(1, 'La ansiedad no siempre se ve como ataques de pánico', 'Muchas veces la ansiedad aparece de formas que no reconocemos como tal.', 'La ansiedad tiene muchas caras. A veces no es el corazón acelerado ni la sensación de ahogo que todos imaginan. Puede ser esa tensión constante en los hombros, la dificultad para concentrarte, el cansancio que no se va con dormir, o esa sensación de que algo malo está por pasar aunque todo esté bien.\n\nReconocer la ansiedad en sus formas más silenciosas es el primer paso para poder trabajarla. No tenés que estar en crisis para pedir ayuda.', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800', 'la-ansiedad-no-siempre-se-ve-como-ataques-de-panico', 1, '2026-04-08 04:28:16', '2026-04-08 04:28:16'),
(2, 'Co-regulación: no siempre tenés que regularte sola', 'Hay algo que muchas personas sienten pero no saben nombrar: ese alivio que aparece cuando estás con alguien que te calma.', 'Desde que nacemos, nuestro sistema nervioso no está preparado para autorregularse solo. Necesitamos de otro sistema nervioso más regulado que nos ayude a organizarnos.\n\nUn bebé no puede calmarse sin otro — necesita contacto, mirada, tono de voz, presencia. Y esto no desaparece cuando crecemos, sino que se transforma.\n\nBuscar contención no es debilidad. Es biología.', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', 'co-regulacion-no-siempre-tenes-que-regularte-sola', 1, '2026-04-08 04:28:16', '2026-04-08 04:28:16'),
(3, 'Aunque estés bien, no siempre te sentís bien', 'Estar bien no significa sentirse bien todo el tiempo. Y esa diferencia importa.', 'Hay días en que todo está objetivamente bien — trabajo, vínculos, salud — y aun así algo pesa. Eso no significa que estés rota ni que seas ingrata.\n\nLas emociones no siempre tienen una razón lógica. A veces el cuerpo necesita procesar cosas que la mente todavía no terminó de entender.\n\nDarte permiso para no estar bien aunque \"no tengas motivos\" es un acto de honestidad y de cuidado propio.', 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800', 'aunque-estes-bien-no-siempre-te-sentis-bien', 1, '2026-04-08 04:28:16', '2026-04-08 04:28:16'),
(4, 'Mi mente no frena', 'Pensamientos que no paran, repaso constante de situaciones, dificultad para descansar la cabeza.', 'Si tu mente no para nunca — si cuando querés dormir empiezan los pensamientos, si repasás conversaciones una y otra vez, si planificás escenarios que probablemente nunca pasen — no estás exagerando.\n\nEso tiene nombre: rumiación. Y es una de las formas más comunes en que la ansiedad se instala sin que la reconozcamos como tal.\n\nNo es un defecto de carácter. Es una respuesta del sistema nervioso que aprendió a estar en alerta. Y se puede trabajar.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'mi-mente-no-frena', 1, '2026-04-08 04:28:16', '2026-04-08 04:28:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `tipo_sesion` enum('primera_sesion','individual','grupal') NOT NULL DEFAULT 'primera_sesion',
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `estado` enum('pendiente','confirmado','cancelado') NOT NULL DEFAULT 'pendiente',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id`, `fecha`, `hora`, `tipo_sesion`, `nombre`, `email`, `telefono`, `estado`, `created_at`) VALUES
(1, '2026-04-15', '10:00:00', 'primera_sesion', 'Ana López', 'ana@email.com', '+54 11 1111-0001', 'confirmado', '2026-03-26 01:16:22'),
(2, '2026-04-15', '14:00:00', 'primera_sesion', 'Juan Pérez', 'juan@email.com', '+54 11 1111-0002', 'confirmado', '2026-03-26 01:16:22'),
(3, '2026-04-16', '09:00:00', 'primera_sesion', 'Laura Gómez', 'laura@email.com', NULL, 'pendiente', '2026-03-26 01:16:22'),
(4, '2026-04-16', '11:00:00', 'primera_sesion', 'Carlos Ruiz', 'carlos@email.com', '+54 11 1111-0003', 'confirmado', '2026-03-26 01:16:22'),
(5, '2026-04-20', '15:00:00', 'primera_sesion', 'Sofía Díaz', 'sofia@email.com', NULL, 'pendiente', '2026-03-26 01:16:22'),
(6, '2026-03-27', '12:00:00', 'primera_sesion', 'Lucas Aguirre', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-26 04:39:52'),
(7, '2026-03-26', '12:00:00', 'primera_sesion', 'Marina Melgem', 'lufrancolu@gmail.com', '03053743000', 'pendiente', '2026-03-26 04:40:25'),
(8, '2026-04-01', '11:00:00', 'primera_sesion', 'Lucas Aguirre', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-31 03:00:15'),
(9, '2026-04-01', '18:00:00', 'primera_sesion', 'Lucas Aguirre', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-31 03:06:45'),
(10, '2026-03-31', '10:00:00', 'primera_sesion', 'Juan Cattaneo', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-31 03:11:18'),
(11, '2026-03-31', '11:00:00', 'primera_sesion', 'Lucas Aguirre', 'lufrancolu@gmail.com', '17867210044', 'pendiente', '2026-03-31 03:16:46'),
(12, '2026-03-31', '12:00:00', 'primera_sesion', 'Juan Cattaneo', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-31 03:49:13'),
(13, '2026-03-31', '14:00:00', 'primera_sesion', 'Lucas Aguirre', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-31 03:53:25'),
(14, '2026-03-31', '15:00:00', 'primera_sesion', 'Lucas Aguirre', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-31 03:56:42'),
(15, '2026-03-31', '16:00:00', 'primera_sesion', 'Juan Cattaneo', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-31 03:57:56'),
(16, '2026-03-31', '17:00:00', 'primera_sesion', 'Lucas Aguirre', 'lufrancolu@gmail.com', '01165830511', 'pendiente', '2026-03-31 04:01:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `aclaracion` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `celular`, `dni`, `aclaracion`, `activo`) VALUES
(1, 'Frank', 'Buster', 'qwe@gmail.com', '1193868511', '43245002', 'qweqwe', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autenticacion`
--
ALTER TABLE `autenticacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `detalle_reserva`
--
ALTER TABLE `detalle_reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detalle_reserva` (`reserva_id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reserva_usuario` (`usuario_id`);

--
-- Indices de la tabla `sesiones_personalizadas`
--
ALTER TABLE `sesiones_personalizadas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `topicos`
--
ALTER TABLE `topicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_turno` (`fecha`,`hora`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autenticacion`
--
ALTER TABLE `autenticacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_reserva`
--
ALTER TABLE `detalle_reserva`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `sesiones_personalizadas`
--
ALTER TABLE `sesiones_personalizadas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `topicos`
--
ALTER TABLE `topicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `autenticacion`
--
ALTER TABLE `autenticacion`
  ADD CONSTRAINT `autenticacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_reserva`
--
ALTER TABLE `detalle_reserva`
  ADD CONSTRAINT `fk_detalle_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
