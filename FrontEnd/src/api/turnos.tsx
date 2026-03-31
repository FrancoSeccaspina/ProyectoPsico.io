import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3033/admin/turnos',
});

// ── Públicas ──────────────────────────────────────────────────────
export const getTurnosOcupados = (mes: string) =>
  API.get(`/turnos?mes=${mes}`);

export const reservarTurno = (data: {
  fecha: string;
  hora: string;
  nombre: string;
  email: string;
  telefono?: string;
  tipo_sesion: 'primera_sesion' | 'individual' | 'grupal';
}) => API.post('/turnos', data);

// ── Admin ─────────────────────────────────────────────────────────
export const getTodosLosTurnos = () =>
  API.get('/admin/turnos');

export const cambiarEstado = (id: number, estado: string) =>
  API.patch(`/admin/turnos/${id}/estado`, { estado });

export const editarTurno = (id: number, data: object) =>
  API.put(`/admin/turnos/${id}`, data);

export const eliminarTurno = (id: number) =>
  API.delete(`/admin/turnos/${id}`);