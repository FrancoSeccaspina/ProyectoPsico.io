/* POSIBLE RUTAS DE RESERVA */

import { Router } from "express";
import reservaController from "../controller/reservaController.js";

const router = Router();

router.get("/", reservaController.getReservas);
router.get("/:id", reservaController.getReservaById);
router.get("/usuario/:usuario_id", reservaController.getReservasByUsuario);

router.post("/", reservaController.createReserva);
router.put("/:id", reservaController.updateReserva);
router.delete("/:id", reservaController.deleteReserva);

export default router;