/* POSIBLE RUTAS DE RESERVA */

import { Router } from "express";
import sesionesController from "../controller/sesiones_personalizadas";

const router = Router();

// PUBLICO
router.get("/", sesionesController.getSesionesPublicas);
router.get("/:id", sesionesController.getSesionById);

// ADMIN
router.post("/", sesionesController.createSesion);
router.put("/:id", sesionesController.updateSesion);
router.delete("/:id", sesionesController.deleteSesion);

export default router;