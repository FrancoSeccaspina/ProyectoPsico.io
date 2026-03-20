import { Router } from "express";
import reservaApiController from "../../controller/api/reserva.api.controller.js";

const router = Router();

router.get("/reserva", reservaApiController.getReservas);
router.get("/reserva/:id", reservaApiController.getReservaById);

export default router;