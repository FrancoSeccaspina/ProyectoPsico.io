import { Router } from 'express';
import usuarioController from '../controller/usersController.js';
import route from './view.routes.js';

const router = Router();

// Obtener todos los activos
router.get("/usuarios", usuarioController.getUsuarios);
router.get("/:id", usuarioController.getUsuarioById);
router.delete("/:id", usuarioController.deleteUsuario);

export default router;