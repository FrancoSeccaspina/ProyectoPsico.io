import { Router } from 'express';
import UsuarioApiController from '../../controller/api/usuarios.api.controller.js';
import route from   '../view.routes.js';

const router = Router();

// Obtener todos los activos
router.get("/usuarios", UsuarioApiController.getUsuarios);
router.get("/usuarios/:id", UsuarioApiController.getUsuarioById);
router.delete("/usuarios/:id", UsuarioApiController.deleteUsuario);

export default router;