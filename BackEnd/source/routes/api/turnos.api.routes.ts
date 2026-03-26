import { Router } from 'express';
import  TurnoApiController  from '../../controller/api/turnos.api.controller.js';

const router = Router();

// GET /api/turnos?mes=2026-04  → trae turnos ocupados del mes
router.get('/turnos', TurnoApiController.getTurnosPorMes);

// POST /api/turnos              → reserva un turno nuevo
router.post('/turnos', TurnoApiController.reservarTurno);

// PATCH /api/turnos/:id/cancelar → cancela un turno existente
router.patch('/turnos/:id/cancelar', TurnoApiController.cancelarTurno);

export default router;