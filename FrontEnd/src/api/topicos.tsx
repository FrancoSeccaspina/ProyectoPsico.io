import axios from 'axios';

export type TipoBloque = 'titulo' | 'subtitulo' | 'texto' | 'imagen';

export interface Bloque {
  id: string;
  tipo: TipoBloque;
  valor: string;
}

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Públicas ──────────────────────────────────────────────────────
export const getTodosLosTopicos = () =>
  API.get('/topicos');

export const getTopicoPorSlug = (slug: string) =>
  API.get(`/topicos/${slug}`);

// ── Admin ─────────────────────────────────────────────────────────
export const getTodosTopicosAdmin = () =>
  API.get('/admin/topicos');

export const crearTopico = (data: {
  resenia: string;
  bloques: Bloque[];
  publicado?: boolean;
}) =>
  API.post('/admin/topicos', data);

export const editarTopico = (id: number, data: {
  resenia?: string;
  bloques?: Bloque[];
  publicado?: boolean;
}) =>
  API.put(`/admin/topicos/${id}`, data);

export const eliminarTopico = (id: number) =>
  API.delete(`/admin/topicos/${id}`);