/* POSIBLES RUTAS DE USUARIOS */

import { Router } from "express";
import usuarioController, { UsuarioController } from "../controller/usersController.js";

const router = Router();

router.get("/", usuarioController.getUsuarios);
router.get("/:id", usuarioController.getUsuarioById);
router.post("/", usuarioController.createUsuario);
router.put("/:id", usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);
export default router;