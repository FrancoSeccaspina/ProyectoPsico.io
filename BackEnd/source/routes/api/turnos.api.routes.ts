import { Router } from 'express';
import TurnoApiController from '../../controller/api/turnos.api.controller.js';

const router = Router();

// ── Públicas ──────────────────────────────────────────────────────
router.get('/turnos', TurnoApiController.getTurnosPorMes);
router.post('/turnos', TurnoApiController.reservarTurno);
router.patch('/turnos/:id/cancelar', TurnoApiController.cancelarTurno);

// ── Admin ─────────────────────────────────────────────────────────
router.get('/admin/turnos', TurnoApiController.getTodosLosTurnos);
router.patch('/admin/turnos/:id/estado', TurnoApiController.cambiarEstado);
router.put('/admin/turnos/:id', TurnoApiController.editarTurno);
router.delete('/admin/turnos/:id', TurnoApiController.eliminarTurno);

export default router;