import { useEffect, useState } from 'react';
import '../../css/adminTopicos.css';
import {
  getTodosTopicosAdmin,
  crearTopico,
  editarTopico,
  eliminarTopico,
} from '../../api/topicos';

// ── Tipos ──────────────────────────────────────────────────────────
type TipoBloque = 'titulo' | 'subtitulo' | 'texto' | 'imagen';

interface Bloque {
  id: string;
  tipo: TipoBloque;
  valor: string;
}

interface Topico {
  id: number;
  titulo: string;
  resenia: string;
  imagen_url: string | null;
  slug: string;
  publicado: boolean;
  bloques: Bloque[] | string; // puede venir como string desde la BD
}

interface FormData {
  resenia: string;
  bloques: Bloque[];
  publicado: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────
const nuevoBloque = (tipo: TipoBloque): Bloque => ({
  id: crypto.randomUUID(),
  tipo,
  valor: '',
});

// 👇 Fix: parsea bloques sin importar si vienen como string o array
const parsearBloques = (bloques: any): Bloque[] => {
  if (Array.isArray(bloques)) return bloques;
  try { return JSON.parse(bloques) ?? []; }
  catch { return []; }
};

const FORM_VACIO: FormData = {
  resenia: '',
  bloques: [nuevoBloque('titulo')],
  publicado: true,
};

const LABELS: Record<TipoBloque, string> = {
  titulo:    'Título',
  subtitulo: 'Subtítulo',
  texto:     'Texto',
  imagen:    'Imagen (URL)',
};

// ── Componente ─────────────────────────────────────────────────────
export default function AdminTopicos() {
  const [topicos, setTopicos]     = useState<Topico[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando]   = useState<Topico | null>(null);
  const [form, setForm]           = useState<FormData>(FORM_VACIO);
  const [error, setError]         = useState('');

  // ── Cargar ───────────────────────────────────────────────────────
  const cargarTopicos = async () => {
    setLoading(true);
    try {
      const res = await getTodosTopicosAdmin();
      setTopicos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarTopicos(); }, []);

  // ── Modal ────────────────────────────────────────────────────────
  const abrirModal = (topico?: Topico) => {
    setError('');
    if (topico) {
      setEditando(topico);
      const bloques = parsearBloques(topico.bloques);
      setForm({
        resenia:   topico.resenia,
        bloques:   bloques.length ? bloques : [nuevoBloque('titulo')],
        publicado: topico.publicado,
      });
    } else {
      setEditando(null);
      setForm(FORM_VACIO);
    }
    setModalOpen(true);
  };

  // ── Bloques ──────────────────────────────────────────────────────
  const agregarBloque = (tipo: TipoBloque) =>
    setForm(f => ({ ...f, bloques: [...f.bloques, nuevoBloque(tipo)] }));

  const actualizarBloque = (id: string, valor: string) =>
    setForm(f => ({
      ...f,
      bloques: f.bloques.map(b => (b.id === id ? { ...b, valor } : b)),
    }));

  const eliminarBloque = (id: string) =>
    setForm(f => ({ ...f, bloques: f.bloques.filter(b => b.id !== id) }));

  const moverBloque = (id: string, direccion: 'arriba' | 'abajo') => {
    setForm(f => {
      const arr  = [...f.bloques];
      const idx  = arr.findIndex(b => b.id === id);
      const swap = direccion === 'arriba' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= arr.length) return f;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return { ...f, bloques: arr };
    });
  };

  // ── Guardar ──────────────────────────────────────────────────────
  const handleGuardar = async () => {
    const tieneTitulo = form.bloques.some(b => b.tipo === 'titulo' && b.valor.trim());
    if (!form.resenia.trim() || !tieneTitulo) {
      setError('Necesitás una reseña y al menos un bloque de título con texto');
      return;
    }
    try {
      if (editando) {
        await editarTopico(editando.id, form);
      } else {
        await crearTopico(form);
      }
      setModalOpen(false);
      cargarTopicos();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="admin-container">
      {/* HEADER */}
      <div className="welcome-card">
        <p className="muted">Panel de administración</p>
        <h1>Tópicos del <span className="accent-text">Blog</span></h1>
      </div>

      {/* BOTÓN */}
      <div className="table-header-main">
        <h2>Listado</h2>
        <button className="btn-primary" onClick={() => abrirModal()}>+ Nuevo tópico</button>
      </div>

      {/* TABLA */}
      {loading ? <p>Cargando...</p> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Bloques</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {topicos.map(t => (
              <tr key={t.id}>
                <td>#{t.id}</td>
                <td>{t.titulo}</td>
                <td>{parsearBloques(t.bloques).length} bloques</td>
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
                  <button className="btn-edit"   onClick={() => abrirModal(t)}>✎</button>
                  <button className="btn-delete" onClick={() => eliminarTopico(t.id).then(cargarTopicos)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content modal-wide" onClick={e => e.stopPropagation()}>
            <h3>{editando ? 'Editar' : 'Crear'} tópico</h3>
            {error && <p className="error">{error}</p>}

            {/* Reseña */}
            <textarea
              className="input"
              placeholder="Reseña (descripción corta)"
              value={form.resenia}
              onChange={e => setForm({ ...form, resenia: e.target.value })}
            />

            {/* Bloques */}
            <div className="bloques-lista">
              {form.bloques.map((bloque, idx) => (
                <div key={bloque.id} className="bloque-item">
                  <div className="bloque-header">
                    <span className="bloque-tipo">{LABELS[bloque.tipo]}</span>
                    <div className="bloque-acciones">
                      <button onClick={() => moverBloque(bloque.id, 'arriba')} disabled={idx === 0}>↑</button>
                      <button onClick={() => moverBloque(bloque.id, 'abajo')} disabled={idx === form.bloques.length - 1}>↓</button>
                      <button className="btn-delete" onClick={() => eliminarBloque(bloque.id)}>✕</button>
                    </div>
                  </div>

                  {bloque.tipo === 'imagen' ? (
                    <input
                      className="input"
                      placeholder="https://..."
                      value={bloque.valor}
                      onChange={e => actualizarBloque(bloque.id, e.target.value)}
                    />
                  ) : (
                    <textarea
                      className="input"
                      placeholder={`${LABELS[bloque.tipo]}...`}
                      value={bloque.valor}
                      rows={bloque.tipo === 'texto' ? 4 : 2}
                      onChange={e => actualizarBloque(bloque.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Agregar bloque */}
            <div className="agregar-bloque">
              <span>Agregar:</span>
              {(['titulo', 'subtitulo', 'texto', 'imagen'] as TipoBloque[]).map(tipo => (
                <button key={tipo} className="btn-bloque" onClick={() => agregarBloque(tipo)}>
                  + {LABELS[tipo]}
                </button>
              ))}
            </div>

            {/* Toggle publicado */}
            <div className="toggle-container">
              <span>Estado:</span>
              <div
                className={`toggle ${form.publicado ? 'active' : ''}`}
                onClick={() => setForm({ ...form, publicado: !form.publicado })}
              >
                <div className="toggle-circle" />
              </div>
              <span className="toggle-label">{form.publicado ? 'Publicado' : 'Borrador'}</span>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="btn-primary"   onClick={handleGuardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}