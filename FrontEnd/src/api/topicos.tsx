import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
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
  titulo: string;
  resenia: string;
  contenido: string;
  imagen_url?: string;
  publicado?: boolean;
}) => API.post('/admin/topicos', data);

export const editarTopico = (id: number, data: object) =>
  API.put(`/admin/topicos/${id}`, data);

export const eliminarTopico = (id: number) =>
  API.delete(`/admin/topicos/${id}`);