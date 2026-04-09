import { Request, Response } from 'express';
import { Topico } from '../../database/models/topico.js';

export type TipoBloque = 'titulo' | 'subtitulo' | 'texto' | 'imagen';

export interface Bloque {
  id: string;        // uuid generado en el frontend
  tipo: TipoBloque;
  valor: string;
}

const generarSlug = (titulo: string): string =>
  titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// Extrae el primer bloque de tipo 'titulo' como título principal
const extraerTituloPrincipal = (bloques: Bloque[]): string =>
  bloques.find(b => b.tipo === 'titulo')?.valor?.trim() || '';

// Extrae la primera imagen como imagen_url principal (para listados)
const extraerImagenPrincipal = (bloques: Bloque[]): string | null =>
  bloques.find(b => b.tipo === 'imagen')?.valor?.trim() || null;

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
      const { resenia, bloques, publicado }: {
        resenia: string;
        bloques: Bloque[];
        publicado?: boolean;
      } = req.body;

      if (!resenia || !Array.isArray(bloques) || bloques.length === 0) {
        res.status(400).json({ error: 'Faltan campos obligatorios: resenia, bloques' });
        return;
      }

      const titulo = extraerTituloPrincipal(bloques);
      if (!titulo) {
        res.status(400).json({ error: 'Debe haber al menos un bloque de tipo "titulo"' });
        return;
      }

      const slug = generarSlug(titulo);
      const existe = await Topico.findOne({ where: { slug } });
      if (existe) {
        res.status(409).json({ error: 'Ya existe un tópico con ese título' });
        return;
      }

      const imagen_url = extraerImagenPrincipal(bloques);

      const topico = await Topico.create({
        titulo,
        resenia: resenia.trim(),
        contenido: '',        // se mantiene por compatibilidad, ya no se usa
        imagen_url,
        slug,
        publicado: publicado ?? true,
        bloques,
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
      const { resenia, bloques, publicado }: {
        resenia?: string;
        bloques?: Bloque[];
        publicado?: boolean;
      } = req.body;

      const topico = await Topico.findByPk(id);
      if (!topico) {
        res.status(404).json({ error: 'Tópico no encontrado' });
        return;
      }

      let titulo = topico.titulo;
      let slug   = topico.slug;
      let imagen_url = topico.imagen_url;

      if (bloques && bloques.length > 0) {
        const nuevoTitulo = extraerTituloPrincipal(bloques);
        if (nuevoTitulo && nuevoTitulo !== titulo) {
          titulo = nuevoTitulo;
          slug   = generarSlug(titulo);
        }
        imagen_url = extraerImagenPrincipal(bloques);
      }

      await topico.update({
        titulo,
        slug,
        imagen_url,
        ...(resenia  !== undefined && { resenia: resenia.trim() }),
        ...(bloques  !== undefined && { bloques }),
        ...(publicado !== undefined && { publicado }),
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