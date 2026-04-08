import { useEffect, useState } from 'react';
import {
  getTodosTopicosAdmin,
  crearTopico,
  editarTopico,
  eliminarTopico,
} from '../../api/topicos';

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface Topico {
  id: number;
  titulo: string;
  resenia: string;
  contenido: string;
  imagen_url: string | null;
  slug: string;
  publicado: boolean;
  created_at?: string;
}

interface FormData {
  titulo: string;
  resenia: string;
  contenido: string;
  imagen_url: string;
  publicado: boolean;
}

// ── Constantes ─────────────────────────────────────────────────────────────────
const FORM_VACIO: FormData = {
  titulo:    '',
  resenia:   '',
  contenido: '',
  imagen_url:'',
  publicado: true,
};

// ── Modal crear / editar ───────────────────────────────────────────────────────
interface ModalProps {
  topico:  Topico | null;
  onClose: () => void;
  onSave:  () => void;
}

function TopicoModal({ topico, onClose, onSave }: ModalProps) {
  const isEdit = !!topico;

  const [form, setForm] = useState<FormData>(
    isEdit
      ? {
          titulo:     topico.titulo,
          resenia:    topico.resenia,
          contenido:  topico.contenido,
          imagen_url: topico.imagen_url ?? '',
          publicado:  topico.publicado,
        }
      : FORM_VACIO,
  );

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.titulo || !form.resenia || !form.contenido) {
      setError('Completá título, reseña y contenido.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await editarTopico(topico.id, form);
      } else {
        await crearTopico(form);
      }
      onSave();
      onClose();
    } catch {
      setError('No se pudo guardar el tópico. Verificá la conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={s.modalHeader}>
          <span style={s.modalTitle}>{isEdit ? 'Editar Tópico' : 'Nuevo Tópico'}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={s.modalBody}>
          {error && <div style={s.errorBox}>{error}</div>}

          <label style={s.label}>Título *</label>
          <input
            style={s.input}
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Ej: La ansiedad no siempre se ve como ataques de pánico"
          />

          <label style={s.label}>Reseña breve *</label>
          <textarea
            style={{ ...s.input, height: 72, resize: 'vertical' }}
            name="resenia"
            value={form.resenia}
            onChange={handleChange}
            placeholder="Un párrafo corto que aparece en la vista de lista..."
          />

          <label style={s.label}>Contenido completo *</label>
          <textarea
            style={{ ...s.input, height: 180, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }}
            name="contenido"
            value={form.contenido}
            onChange={handleChange}
            placeholder="Texto completo del tópico. Podés usar saltos de línea para separar párrafos."
          />

          <label style={s.label}>URL de imagen</label>
          <input
            style={s.input}
            name="imagen_url"
            value={form.imagen_url}
            onChange={handleChange}
            placeholder="https://..."
          />

          {/* Preview imagen */}
          {form.imagen_url && (
            <div style={{ marginTop: 4, marginBottom: 4 }}>
              <img
                src={form.imagen_url}
                alt="preview"
                style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e5e5' }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}

          {/* Toggle publicado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <div
              style={{
                width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                background: form.publicado ? '#6366f1' : '#ddd',
                position: 'relative', transition: 'background 0.2s',
              }}
              onClick={() => setForm(prev => ({ ...prev, publicado: !prev.publicado }))}
            >
              <div style={{
                position: 'absolute', top: 3, left: form.publicado ? 21 : 3,
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </div>
            <span style={{ fontSize: 13, color: '#555' }}>
              {form.publicado ? 'Publicado' : 'Borrador'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={s.modalFooter}>
          <button style={s.btnSecondary} onClick={onClose}>Cancelar</button>
          <button
            style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear tópico'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function AdminTopicos() {
  const [topicos,      setTopicos]      = useState<Topico[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState('');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTopico,   setEditTopico]   = useState<Topico | null>(null);
  const [deleteId,     setDeleteId]     = useState<number | null>(null);
  const [filterPub,    setFilterPub]    = useState('todos');
  const [searchTitulo, setSearchTitulo] = useState('');

  // ── Carga ─────────────────────────────────────────────────────────────────
  const cargarTopicos = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await getTodosTopicosAdmin();
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setTopicos(data);
    } catch (error) {
      console.error('Error al cargar tópicos:', error);
      setFetchError('No se pudo conectar con la API. Verificá que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarTopicos(); }, []);

  // ── Eliminar ──────────────────────────────────────────────────────────────
  const handleEliminar = async (id: number) => {
    try {
      await eliminarTopico(id);
      setDeleteId(null);
      cargarTopicos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el tópico.');
    }
  };

  // ── Filtros ───────────────────────────────────────────────────────────────
  const filtered = topicos.filter(t => {
    const matchPub =
      filterPub === 'todos' ||
      (filterPub === 'publicado' && t.publicado) ||
      (filterPub === 'borrador'  && !t.publicado);
    const matchTitulo =
      searchTitulo === '' ||
      t.titulo.toLowerCase().includes(searchTitulo.toLowerCase());
    return matchPub && matchTitulo;
  });

  const counts = {
    total:     topicos.length,
    publicado: topicos.filter(t => t.publicado).length,
    borrador:  topicos.filter(t => !t.publicado).length,
  };

  const stats = [
    { label: 'Total',      value: counts.total,     color: '#6366f1', icon: '📚' },
    { label: 'Publicados', value: counts.publicado, color: '#10b981', icon: '✅' },
    { label: 'Borradores', value: counts.borrador,  color: '#f59e0b', icon: '📝' },
  ];

  const filterOpts = [
    { label: 'Todos',      value: 'todos'     },
    { label: 'Publicados', value: 'publicado' },
    { label: 'Borradores', value: 'borrador'  },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Bienvenida */}
        <div style={s.welcomeCard}>
          <div>
            <p style={s.welcomeSub}>Panel de administración</p>
            <h1 style={s.welcomeTitle}>
              Tópicos del <span style={{ color: '#6366f1' }}>Blog</span> 📚
            </h1>
            <p style={s.welcomeDesc}>Creá, editá y publicá los tópicos de tu blog.</p>
          </div>
          <span style={s.dateText}>
            {new Date().toLocaleDateString('es-AR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>

        {/* Stats */}
        <div style={{ ...s.statsGrid, gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ ...s.statCard, borderTop: `4px solid ${stat.color}` }}>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <span style={{ ...s.statValue, color: stat.color }}>{stat.value}</span>
              <span style={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div style={s.tableCard}>
          {/* Header */}
          <div style={s.tableHeader}>
            <h2 style={s.tableTitle}>Detalle de Tópicos</h2>
            <button
              style={s.btnPrimary}
              onClick={() => { setEditTopico(null); setModalOpen(true); }}
            >
              + Nuevo tópico
            </button>
          </div>

          {/* Filtros */}
          <div style={s.filtersRow}>
            <input
              style={{ ...s.input, maxWidth: 280, marginBottom: 0 }}
              placeholder="Buscar por título..."
              value={searchTitulo}
              onChange={e => setSearchTitulo(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {filterOpts.map(({ label, value }) => (
                <button
                  key={value}
                  style={{
                    ...s.filterBtn,
                    ...(filterPub === value ? s.filterBtnActive : {}),
                  }}
                  onClick={() => setFilterPub(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido */}
          {loading ? (
            <div style={s.centerMsg}>
              <div style={s.spinner} />
              <p>Cargando tópicos...</p>
            </div>
          ) : fetchError ? (
            <div style={s.centerMsg}>
              <p style={{ color: '#ef4444' }}>{fetchError}</p>
              <button style={s.btnSecondary} onClick={cargarTopicos}>Reintentar</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={s.centerMsg}>
              <p style={{ fontSize: 40 }}>📭</p>
              <p style={{ color: '#aaa' }}>No hay tópicos para mostrar.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['ID', 'Imagen', 'Título', 'Reseña', 'Slug', 'Estado', 'Fecha', 'Acciones'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9fb' }}>
                      <td style={s.td}>
                        <span style={s.idBadge}>#{t.id}</span>
                      </td>
                      <td style={s.td}>
                        {t.imagen_url ? (
                          <img
                            src={t.imagen_url}
                            alt={t.titulo}
                            style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e5e5' }}
                            onError={e => (e.currentTarget.style.display = 'none')}
                          />
                        ) : (
                          <div style={{ width: 56, height: 40, background: '#f0f0ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                            🖼️
                          </div>
                        )}
                      </td>
                      <td style={{ ...s.td, maxWidth: 200 }}>
                        <strong style={{ fontSize: 13, lineHeight: 1.4 }}>{t.titulo}</strong>
                      </td>
                      <td style={{ ...s.td, maxWidth: 220, color: '#888', fontSize: 12 }}>
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {t.resenia}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontSize: 11, color: '#aaa', fontFamily: 'monospace' }}>
                        {t.slug}
                      </td>
                      <td style={s.td}>
                        <span style={{
                          ...s.estadoBadge,
                          background: t.publicado ? '#d1fae5' : '#fef3c7',
                          color:      t.publicado ? '#065f46' : '#92400e',
                        }}>
                          {t.publicado ? '✅ Publicado' : '📝 Borrador'}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontSize: 13, color: '#888' }}>
                        {t.created_at
                          ? new Date(t.created_at).toLocaleDateString('es-AR')
                          : '—'}
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            style={s.btnEdit}
                            title="Editar"
                            onClick={() => { setEditTopico(t); setModalOpen(true); }}
                          >
                            ✎
                          </button>
                          <button
                            style={s.btnDelete}
                            title="Eliminar"
                            onClick={() => setDeleteId(t.id)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal crear / editar */}
      {modalOpen && (
        <TopicoModal
          topico={editTopico}
          onClose={() => { setModalOpen(false); setEditTopico(null); }}
          onSave={cargarTopicos}
        />
      )}

      {/* Modal confirmar eliminación */}
      {deleteId !== null && (
        <div style={s.overlay} onClick={() => setDeleteId(null)}>
          <div style={{ ...s.modal, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Confirmar eliminación</span>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                ¿Estás segura de que querés eliminar el tópico{' '}
                <strong>#{deleteId}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnSecondary} onClick={() => setDeleteId(null)}>Cancelar</button>
              <button
                style={{ ...s.btnPrimary, background: '#ef4444' }}
                onClick={() => handleEliminar(deleteId)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Estilos (mismo sistema que AdminPanel) ─────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page:        { minHeight: '100vh', background: '#f4f4f8', fontFamily: 'sans-serif' },
  container:   { maxWidth: 1300, margin: '0 auto', padding: '32px 16px' },

  welcomeCard: { background: '#fff', borderRadius: 16, padding: '28px 32px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  welcomeSub:  { color: '#888', margin: '0 0 4px', fontSize: 13 },
  welcomeTitle:{ margin: '0 0 6px', fontSize: 24, fontWeight: 700 },
  welcomeDesc: { margin: 0, color: '#888', fontSize: 14 },
  dateText:    { color: '#888', fontSize: 13, textAlign: 'right' as const },

  statsGrid:   { display: 'grid', gap: 16, marginBottom: 24 },
  statCard:    { background: '#fff', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column' as const, gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statValue:   { fontSize: 32, fontWeight: 700 },
  statLabel:   { fontSize: 13, color: '#888' },

  tableCard:   { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f0f0f0' },
  tableTitle:  { margin: 0, fontSize: 18, fontWeight: 700 },
  filtersRow:  { display: 'flex', gap: 12, alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap' as const },
  table:       { width: '100%', borderCollapse: 'collapse' as const, fontSize: 14 },
  th:          { padding: '12px 16px', background: '#f4f4f8', fontWeight: 700, fontSize: 12, textAlign: 'left' as const, borderBottom: '1px solid #e5e5e5' },
  td:          { padding: '14px 16px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' as const },
  idBadge:     { background: '#f0f0ff', color: '#6366f1', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 },
  estadoBadge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  centerMsg:   { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 12 },
  spinner:     { width: 36, height: 36, border: '3px solid #e5e5e5', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

  btnEdit:     { background: '#ede9fe', color: '#6366f1', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 14 },
  btnDelete:   { background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 14 },

  filterBtn:       { background: '#f4f4f8', border: '1px solid #e5e5e5', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, color: '#555' },
  filterBtnActive: { background: '#6366f1', color: '#fff', borderColor: '#6366f1' },

  btnPrimary:   { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  btnSecondary: { background: '#f4f4f8', color: '#333', border: '1px solid #e5e5e5', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontSize: 14 },

  overlay:     { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal:       { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' as const, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid #f0f0f0' },
  modalTitle:  { fontWeight: 700, fontSize: 18 },
  closeBtn:    { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' },
  modalBody:   { padding: '24px 28px', display: 'flex', flexDirection: 'column' as const, gap: 6 },
  modalFooter: { display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '16px 28px', borderTop: '1px solid #f0f0f0' },
  errorBox:    { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 8 },
  label:       { fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 2 },
  input:       { width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const, outline: 'none', marginBottom: 4 },
};