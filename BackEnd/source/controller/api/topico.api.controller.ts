import { Request, Response } from 'express';
import { Topico } from '../../database/models/topico.js';

// Genera slug a partir del título
const generarSlug = (titulo: string): string =>
  titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export class TopicoApiController {

  // ── Públicas ────────────────────────────────────────────────────

  async getTodosLosTopicos(req: Request, res: Response): Promise<void> {
    try {
      const topicos = await Topico.findAll({
        where: { publicado: true },
        attributes: ['id', 'titulo', 'resenia', 'imagen_url', 'slug', 'created_at'],
        order: [['created_at', 'DESC']],
      });
      res.json(topicos);
    } catch (error) {
      console.error('Error al obtener tópicos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getTopicoPorSlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const topico = await Topico.findOne({ where: { slug, publicado: true } });
      if (!topico) {
        res.status(404).json({ error: 'Tópico no encontrado' });
        return;
      }
      res.json(topico);
    } catch (error) {
      console.error('Error al obtener tópico:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // ── Admin ───────────────────────────────────────────────────────

  async getTodosAdmin(req: Request, res: Response): Promise<void> {
    try {
      const topicos = await Topico.findAll({
        order: [['created_at', 'DESC']],
      });
      res.json(topicos);
    } catch (error) {
      console.error('Error al obtener tópicos (admin):', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async crearTopico(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, resenia, contenido, imagen_url, publicado } = req.body;

      if (!titulo || !resenia || !contenido) {
        res.status(400).json({ error: 'Faltan campos obligatorios: titulo, resenia, contenido' });
        return;
      }

      const slug = generarSlug(titulo);

      const existe = await Topico.findOne({ where: { slug } });
      if (existe) {
        res.status(409).json({ error: 'Ya existe un tópico con ese título' });
        return;
      }

      const topico = await Topico.create({
        titulo: titulo.trim(),
        resenia: resenia.trim(),
        contenido: contenido.trim(),
        imagen_url: imagen_url?.trim() || null,
        slug,
        publicado: publicado ?? true,
      });

      res.status(201).json({ mensaje: 'Tópico creado con éxito', topico });
    } catch (error) {
      console.error('Error al crear tópico:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async editarTopico(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { titulo, resenia, contenido, imagen_url, publicado } = req.body;

      const topico = await Topico.findByPk(id);
      if (!topico) {
        res.status(404).json({ error: 'Tópico no encontrado' });
        return;
      }

      const nuevoSlug = titulo ? generarSlug(titulo) : topico.slug;

      await topico.update({
        ...(titulo    && { titulo: titulo.trim(), slug: nuevoSlug }),
        ...(resenia   && { resenia: resenia.trim() }),
        ...(contenido && { contenido: contenido.trim() }),
        ...(imagen_url !== undefined && { imagen_url: imagen_url?.trim() || null }),
        ...(publicado !== undefined  && { publicado }),
      });

      res.json({ mensaje: 'Tópico actualizado correctamente', topico });
    } catch (error) {
      console.error('Error al editar tópico:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async eliminarTopico(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const topico = await Topico.findByPk(id);
      if (!topico) {
        res.status(404).json({ error: 'Tópico no encontrado' });
        return;
      }

      await topico.destroy();
      res.json({ mensaje: 'Tópico eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar tópico:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

export default new TopicoApiController();