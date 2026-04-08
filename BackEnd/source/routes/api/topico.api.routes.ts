import { Router } from 'express';
import TopicoApiController from '../../controller/api/topico.api.controller.js';

const router = Router();

// ── Públicas ──────────────────────────────────────────────────────
router.get('/topicos', TopicoApiController.getTodosLosTopicos);
router.get('/topicos/:slug', TopicoApiController.getTopicoPorSlug);

// ── Admin ─────────────────────────────────────────────────────────
router.get('/admin/topicos', TopicoApiController.getTodosAdmin);
router.post('/admin/topicos', TopicoApiController.crearTopico);
router.put('/admin/topicos/:id', TopicoApiController.editarTopico);
router.delete('/admin/topicos/:id', TopicoApiController.eliminarTopico);

export default router;