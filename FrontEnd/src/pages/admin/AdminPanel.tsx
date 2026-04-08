import { useEffect, useState } from 'react';
import {
  getTodosLosTurnos,
  cambiarEstado,
  eliminarTurno,
  editarTurno,
  reservarTurno,
} from '../../api/turnos';
import '../../css/AdminPanel.css';

// ── Tipos ──────────────────────────────────────────────────────────────────────
type EstadoTurno = 'pendiente' | 'confirmado' | 'cancelado';
type TipoSesion  = 'primera_sesion' | 'individual' | 'grupal';

interface Turno {
  id: number;
  fecha: string;
  hora: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo_sesion: TipoSesion;
  estado: EstadoTurno;
  created_at?: string;
}

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  tipo_sesion: TipoSesion;
  estado: EstadoTurno;
}

// ── Constantes ─────────────────────────────────────────────────────────────────
const TIPO_LABEL: Record<TipoSesion, string> = {
  primera_sesion: 'Primera Sesión',
  individual:     'Individual',
  grupal:         'Grupal',
};

const ESTADO_COLOR: Record<EstadoTurno, string> = {
  pendiente:  '#f59e0b',
  confirmado: '#10b981',
  cancelado:  '#ef4444',
};

const FORM_VACIO: FormData = {
  nombre:      '',
  email:       '',
  telefono:    '',
  fecha:       '',
  hora:        '',
  tipo_sesion: 'primera_sesion',
  estado:      'pendiente',
};

// ── Modal de creación / edición ────────────────────────────────────────────────
interface ModalProps {
  turno:   Turno | null;
  onClose: () => void;
  onSave:  () => void;
}

function TurnoModal({ turno, onClose, onSave }: ModalProps) {
  const isEdit = !!turno;

  const [form, setForm] = useState<FormData>(
    isEdit
      ? {
          nombre:      turno.nombre,
          email:       turno.email,
          telefono:    turno.telefono ?? '',
          fecha:       turno.fecha,
          hora:        turno.hora.slice(0, 5),
          tipo_sesion: turno.tipo_sesion,
          estado:      turno.estado,
        }
      : FORM_VACIO,
  );

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.fecha || !form.hora) {
      setError('Completá todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await editarTurno(turno.id, form);
      } else {
        await reservarTurno(form);
      }
      onSave();
      onClose();
    } catch {
      setError('No se pudo guardar el turno. Verificá la conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={s.modalHeader}>
          <span style={s.modalTitle}>{isEdit ? 'Editar Turno' : 'Nuevo Turno'}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={s.modalBody}>
          {error && <div style={s.errorBox}>{error}</div>}

          <label style={s.label}>Nombre completo *</label>
          <input style={s.input} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: María García" />

          <label style={s.label}>Email *</label>
          <input style={s.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />

          <label style={s.label}>Teléfono</label>
          <input style={s.input} name="telefono" value={form.telefono} onChange={handleChange} placeholder="+54 11 1234-5678" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={s.label}>Fecha *</label>
              <input style={s.input} name="fecha" type="date" value={form.fecha} onChange={handleChange} />
            </div>
            <div>
              <label style={s.label}>Hora *</label>
              <input style={s.input} name="hora" type="time" value={form.hora} onChange={handleChange} />
            </div>
          </div>

          <label style={s.label}>Tipo de sesión *</label>
          <select style={s.input} name="tipo_sesion" value={form.tipo_sesion} onChange={handleChange}>
            <option value="primera_sesion">Primera Sesión</option>
            <option value="individual">Individual</option>
            <option value="grupal">Grupal</option>
          </select>

          {isEdit && (
            <>
              <label style={s.label}>Estado</label>
              <select style={s.input} name="estado" value={form.estado} onChange={handleChange}>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={s.modalFooter}>
          <button style={s.btnSecondary} onClick={onClose}>Cancelar</button>
          <button
            style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear turno'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function AdminPanel() {
  const [turnos,       setTurnos]       = useState<Turno[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState('');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTurno,    setEditTurno]    = useState<Turno | null>(null);
  const [deleteId,     setDeleteId]     = useState<number | null>(null);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [searchNombre, setSearchNombre] = useState('');

  // ── Carga de datos ────────────────────────────────────────────────────────
  const cargarTurnos = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await getTodosLosTurnos();
      // El backend devuelve { success: true, data: [...] }
      const data = res.data?.data ?? res.data;
      setTurnos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      setFetchError('No se pudo conectar con la API. Verificá que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarTurnos(); }, []);

  // ── Acciones ──────────────────────────────────────────────────────────────
  const handleEstado = async (id: number, estado: EstadoTurno) => {
    try {
      await cambiarEstado(id, estado);
      cargarTurnos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('No se pudo cambiar el estado.');
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarTurno(id);
      setDeleteId(null);
      cargarTurnos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el turno.');
    }
  };

  // ── Filtros ───────────────────────────────────────────────────────────────
  const filtered = turnos.filter(t => {
    const matchEstado = filterEstado === 'todos' || t.estado === filterEstado;
    const matchNombre = searchNombre === '' || t.nombre.toLowerCase().includes(searchNombre.toLowerCase());
    return matchEstado && matchNombre;
  });

  const counts = {
    total:      turnos.length,
    pendiente:  turnos.filter(t => t.estado === 'pendiente').length,
    confirmado: turnos.filter(t => t.estado === 'confirmado').length,
    cancelado:  turnos.filter(t => t.estado === 'cancelado').length,
  };

  const stats = [
    { label: 'Total',      value: counts.total,      color: '#6366f1', icon: '📋' },
    { label: 'Pendientes', value: counts.pendiente,  color: '#f59e0b', icon: '⏳' },
    { label: 'Confirmados',value: counts.confirmado, color: '#10b981', icon: '✅' },
    { label: 'Cancelados', value: counts.cancelado,  color: '#ef4444', icon: '❌' },
  ];

  const filterOpts = [
    { label: 'Todos',      value: 'todos'      },
    { label: 'Pendiente',  value: 'pendiente'  },
    { label: 'Confirmado', value: 'confirmado' },
    { label: 'Cancelado',  value: 'cancelado'  },
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
              Bienvenida, <span style={{ color: '#6366f1' }}>Natalia Ferri</span> 👋
            </h1>
            <p style={s.welcomeDesc}>Gestioná todos los turnos desde este panel.</p>
          </div>
          <span style={s.dateText}>
            {new Date().toLocaleDateString('es-AR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
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
            <h2 style={s.tableTitle}>Detalle de Turnos</h2>
            <button
              style={s.btnPrimary}
              onClick={() => { setEditTurno(null); setModalOpen(true); }}
            >
              + Nuevo turno
            </button>
          </div>

          {/* Filtros */}
          <div style={s.filtersRow}>
            <input
              style={{ ...s.input, maxWidth: 260, marginBottom: 0 }}
              placeholder="Buscar por nombre..."
              value={searchNombre}
              onChange={e => setSearchNombre(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {filterOpts.map(({ label, value }) => (
                <button
                  key={value}
                  style={{
                    ...s.filterBtn,
                    ...(filterEstado === value ? s.filterBtnActive : {}),
                  }}
                  onClick={() => setFilterEstado(value)}
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
              <p>Cargando turnos...</p>
            </div>
          ) : fetchError ? (
            <div style={s.centerMsg}>
              <p style={{ color: '#ef4444' }}>{fetchError}</p>
              <button style={s.btnSecondary} onClick={cargarTurnos}>Reintentar</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={s.centerMsg}>
              <p style={{ fontSize: 40 }}>📭</p>
              <p style={{ color: '#aaa' }}>No hay turnos para mostrar.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['ID','Paciente','Email','Teléfono','Fecha','Hora','Tipo','Estado','Acciones'].map(h => (
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
                        <strong>{t.nombre}</strong>
                      </td>
                      <td style={{ ...s.td, color: '#888', fontSize: 13 }}>{t.email}</td>
                      <td style={{ ...s.td, color: '#888', fontSize: 13 }}>
                        {t.telefono || <span style={{ color: '#ddd' }}>—</span>}
                      </td>
                      <td style={s.td}>
                        {new Date(t.fecha).toLocaleDateString('es-AR')}
                      </td>
                      <td style={s.td}>{t.hora.slice(0, 5)} hs</td>
                      <td style={s.td}>
                        <span style={{ ...s.tipoBadge }}>
                          {TIPO_LABEL[t.tipo_sesion]}
                        </span>
                      </td>
                      <td style={s.td}>
                        {/* Selector de estado inline */}
                        <select
                          style={{
                            ...s.estadoSelect,
                            color: ESTADO_COLOR[t.estado],
                            borderColor: ESTADO_COLOR[t.estado],
                          }}
                          value={t.estado}
                          onChange={e => handleEstado(t.id, e.target.value as EstadoTurno)}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            style={s.btnEdit}
                            title="Editar"
                            onClick={() => { setEditTurno(t); setModalOpen(true); }}
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
        <TurnoModal
          turno={editTurno}
          onClose={() => { setModalOpen(false); setEditTurno(null); }}
          onSave={cargarTurnos}
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
                ¿Estás segura de que querés eliminar el turno{' '}
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

// ── Estilos ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page:        { minHeight: '100vh', background: '#f4f4f8', fontFamily: 'sans-serif' },
  container:   { maxWidth: 1200, margin: '0 auto', padding: '32px 16px' },

  // Bienvenida
  welcomeCard: { background: '#fff', borderRadius: 16, padding: '28px 32px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  welcomeSub:  { color: '#888', margin: '0 0 4px', fontSize: 13 },
  welcomeTitle:{ margin: '0 0 6px', fontSize: 24, fontWeight: 700 },
  welcomeDesc: { margin: 0, color: '#888', fontSize: 14 },
  dateText:    { color: '#888', fontSize: 13, textAlign: 'right' as const },

  // Stats
  statsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard:    { background: '#fff', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column' as const, gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statValue:   { fontSize: 32, fontWeight: 700 },
  statLabel:   { fontSize: 13, color: '#888' },

  // Tabla
  tableCard:   { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f0f0f0' },
  tableTitle:  { margin: 0, fontSize: 18, fontWeight: 700 },
  filtersRow:  { display: 'flex', gap: 12, alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap' as const },
  table:       { width: '100%', borderCollapse: 'collapse' as const, fontSize: 14 },
  th:          { padding: '12px 16px', background: '#f4f4f8', fontWeight: 700, fontSize: 12, textAlign: 'left' as const, borderBottom: '1px solid #e5e5e5' },
  td:          { padding: '14px 16px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' as const },
  idBadge:     { background: '#f0f0ff', color: '#6366f1', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 },
  tipoBadge:   { background: '#f0f0ff', color: '#6366f1', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  estadoSelect:{ border: '1px solid', borderRadius: 8, padding: '4px 8px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'transparent' },
  centerMsg:   { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 12 },
  spinner:     { width: 36, height: 36, border: '3px solid #e5e5e5', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

  // Botones acción tabla
  btnEdit:     { background: '#ede9fe', color: '#6366f1', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 14 },
  btnDelete:   { background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 14 },

  // Filtros
  filterBtn:       { background: '#f4f4f8', border: '1px solid #e5e5e5', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, color: '#555' },
  filterBtnActive: { background: '#6366f1', color: '#fff', borderColor: '#6366f1' },

  // Botones generales
  btnPrimary:   { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  btnSecondary: { background: '#f4f4f8', color: '#333', border: '1px solid #e5e5e5', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontSize: 14 },

  // Modal
  overlay:     { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal:       { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' as const, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid #f0f0f0' },
  modalTitle:  { fontWeight: 700, fontSize: 18 },
  closeBtn:    { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' },
  modalBody:   { padding: '24px 28px', display: 'flex', flexDirection: 'column' as const, gap: 6 },
  modalFooter: { display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '16px 28px', borderTop: '1px solid #f0f0f0' },
  errorBox:    { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 8 },
  label:       { fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 2 },
  input:       { width: '100%', padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const, outline: 'none', marginBottom: 4 },
};