import { useEffect, useState } from 'react';
import '../../css/adminTopicos.css';

import {
  getTodosTopicosAdmin,
  crearTopico,
  editarTopico,
  eliminarTopico,
} from '../../api/topicos';

interface Topico {
  id: number;
  titulo: string;
  resenia: string;
  contenido: string;
  imagen_url: string | null;
  slug: string;
  publicado: boolean;
}

interface FormData {
  titulo: string;
  resenia: string;
  contenido: string;
  imagen_url: string;
  publicado: boolean;
}

const FORM_VACIO: FormData = {
  titulo: '',
  resenia: '',
  contenido: '',
  imagen_url: '',
  publicado: true,
};

export default function AdminTopicos() {
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTopico, setEditTopico] = useState<Topico | null>(null);

  const [form, setForm] = useState<FormData>(FORM_VACIO);
  const [error, setError] = useState('');

  // ── Cargar ─────────────────────────
  const cargarTopicos = async () => {
    setLoading(true);
    try {
      const res = await getTodosTopicosAdmin();
      setTopicos(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTopicos();
  }, []);

  // ── Eliminar ───────────────────────
  const handleEliminar = async (id: number) => {
    await eliminarTopico(id);
    cargarTopicos();
  };

  // ── Abrir modal ────────────────────
  const abrirModal = (topico?: Topico) => {
    if (topico) {
      setEditTopico(topico);
      setForm({
        titulo: topico.titulo,
        resenia: topico.resenia,
        contenido: topico.contenido,
        imagen_url: topico.imagen_url || '',
        publicado: topico.publicado,
      });
    } else {
      setEditTopico(null);
      setForm(FORM_VACIO);
    }

    setError('');
    setModalOpen(true);
  };

  // ── Guardar ────────────────────────
  const handleGuardar = async () => {
    if (!form.titulo || !form.resenia || !form.contenido) {
      setError('Completá todos los campos');
      return;
    }

    try {
      if (editTopico) {
        await editarTopico(editTopico.id, form);
      } else {
        await crearTopico(form);
      }

      setModalOpen(false);
      cargarTopicos();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  return (
    <div className="admin-container">

      {/* HEADER */}
      <div className="welcome-card">
        <p className="muted">Panel de administración</p>
        <h1>
          Tópicos del <span className="accent-text">Blog</span>
        </h1>
      </div>

      {/* BOTÓN */}
      <div className="table-header-main">
        <h2>Listado</h2>
        <button className="btn-primary" onClick={() => abrirModal()}>
          + Nuevo tópico
        </button>
      </div>

      {/* TABLA */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {topicos.map(t => (
              <tr key={t.id}>
                <td>#{t.id}</td>

                <td>{t.titulo}</td>

                {/* 🔥 TOGGLE DIRECTO */}
                <td>
                  <button
                    className={`estado-toggle ${t.publicado ? 'ok' : 'draft'}`}
                    onClick={async () => {
                      await editarTopico(t.id, { publicado: !t.publicado });
                      cargarTopicos();
                    }}
                  >
                    {t.publicado ? 'Publicado' : 'Borrador'}
                  </button>
                </td>

                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => abrirModal(t)}>
                    ✎
                  </button>

                  <button className="btn-delete" onClick={() => handleEliminar(t.id)}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>

            <h3>{editTopico ? 'Editar' : 'Crear'} tópico</h3>

            {error && <p className="error">{error}</p>}

            <input
              className="input"
              placeholder="Título"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
            />

            <textarea
              className="input"
              placeholder="Reseña"
              value={form.resenia}
              onChange={e => setForm({ ...form, resenia: e.target.value })}
            />

            <textarea
              className="input"
              placeholder="Contenido"
              value={form.contenido}
              onChange={e => setForm({ ...form, contenido: e.target.value })}
            />

            <input
              className="input"
              placeholder="URL imagen"
              value={form.imagen_url}
              onChange={e => setForm({ ...form, imagen_url: e.target.value })}
            />

            {/* 🔥 TOGGLE EN MODAL */}
            <div className="toggle-container">
              <span>Estado:</span>

              <div
                className={`toggle ${form.publicado ? 'active' : ''}`}
                onClick={() =>
                  setForm({ ...form, publicado: !form.publicado })
                }
              >
                <div className="toggle-circle" />
              </div>

              <span className="toggle-label">
                {form.publicado ? 'Publicado' : 'Borrador'}
              </span>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>

              <button className="btn-primary" onClick={handleGuardar}>
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}