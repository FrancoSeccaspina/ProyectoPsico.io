import { Router } from "express";
import reservaController from "../controller/reservaController.js";

const router = Router();

// 🔹 Ver detalle de reserva
router.get('/reserva/:id', reservaController.detalle);

export default router;