import { useEffect, useState } from 'react';
import {
  getTodosLosTurnos,
  cambiarEstado,
  eliminarTurno, // Importación del servicio
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
  individual:      'Individual',
  grupal:          'Grupal',
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
function TurnoModal({ turno, onClose, onSave }: { turno: Turno | null, onClose: () => void, onSave: () => void }) {
  const isEdit = !!turno;
  const [form, setForm] = useState<FormData>(isEdit ? { ...turno, telefono: turno.telefono ?? '', hora: turno.hora.slice(0, 5) } : FORM_VACIO);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      isEdit ? await editarTurno(turno.id, form) : await reservarTurno(form);
      onSave();
      onClose();
    } catch (error) {
      alert('Error al guardar el turno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Editar Turno' : 'Nuevo Turno'}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <input className="input" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <div className="form-grid-2">
            <input className="input" type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
            <input className="input" type="time" value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} />
          </div>
          <select className="input" value={form.tipo_sesion} onChange={e => setForm({...form, tipo_sesion: e.target.value as TipoSesion})}>
            <option value="primera_sesion">Primera Sesión</option>
            <option value="individual">Individual</option>
            <option value="grupal">Grupal</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function AdminPanel() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTurno, setEditTurno] = useState<Turno | null>(null);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [searchNombre, setSearchNombre] = useState('');

  const cargarTurnos = async () => {
    setLoading(true);
    try {
      const res = await getTodosLosTurnos();
      const data = res.data?.data ?? res.data;
      setTurnos(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { cargarTurnos(); }, []);

  const handleEstado = async (id: number, estado: EstadoTurno) => {
    try { await cambiarEstado(id, estado); cargarTurnos(); } catch { alert('Error'); }
  };

  // --- NUEVA ACCIÓN ELIMINAR ---
  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este turno? Esta acción no se puede deshacer.')) {
      try {
        await eliminarTurno(id);
        cargarTurnos(); // Recargamos la lista
      } catch (error) {
        alert('No se pudo eliminar el turno.');
      }
    }
  };

  const filtered = turnos.filter(t => 
    (filterEstado === 'todos' || t.estado === filterEstado) &&
    (t.nombre.toLowerCase().includes(searchNombre.toLowerCase()))
  );

  const counts = {
    total: turnos.length,
    pendiente: turnos.filter(t => t.estado === 'pendiente').length,
    confirmado: turnos.filter(t => t.estado === 'confirmado').length,
    cancelado: turnos.filter(t => t.estado === 'cancelado').length,
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        
        <header className="welcome-card">
          <div className="welcome-text">
            <p className="welcome-sub">Panel de administración</p>
            <h1 className="welcome-title">Bienvenida, <span className="accent-text">Natalia Ferri</span> 👋</h1>
          </div>
          <span className="date-text">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </header>

        <section className="stats-grid">
          {[
            { label: 'Total', val: counts.total, col: '#8b5cf6', icon: '📋' },
            { label: 'Pendientes', val: counts.pendiente, col: '#f59e0b', icon: '⏳' },
            { label: 'Confirmados', val: counts.confirmado, col: '#10b981', icon: '✅' },
            { label: 'Cancelados', val: counts.cancelado, col: '#ef4444', icon: '❌' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTop: `4px solid ${s.col}` }}>
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value" style={{ color: s.col }}>{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        <div className="table-card">
          <div className="table-header-main">
            <h2 className="table-title">Detalle de Turnos</h2>
            <button className="btn-primary" onClick={() => { setEditTurno(null); setModalOpen(true); }}>+ Nuevo turno</button>
          </div>

          <div className="table-toolbar">
            <div className="search-wrapper">
              <input className="input search-input" placeholder="Buscar por nombre..." value={searchNombre} onChange={e => setSearchNombre(e.target.value)} />
            </div>
            <div className="filter-group">
              {['todos', 'pendiente', 'confirmado', 'cancelado'].map(f => (
                <button key={f} className={`filter-btn btn-${f} ${filterEstado === f ? 'active' : ''}`} onClick={() => setFilterEstado(f)}>
                  <span className="dot" /> {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="table-content-area">
            {loading ? <div className="center-msg">Cargando...</div> : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>ID</th><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(t => (
                      <tr key={t.id}>
                        <td><span className="badge-id">#{t.id}</span></td>
                        <td><strong>{t.nombre}</strong><br/><small className="text-muted">{t.email}</small></td>
                        <td>{new Date(t.fecha).toLocaleDateString('es-AR')}</td>
                        <td>{t.hora.slice(0,5)} hs</td>
                        <td><span className="tipo-badge">{TIPO_LABEL[t.tipo_sesion]}</span></td>
                        <td>
                          <select className="estado-select" value={t.estado} style={{ color: ESTADO_COLOR[t.estado] }} onChange={e => handleEstado(t.id, e.target.value as EstadoTurno)}>
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-edit" title="Editar" onClick={() => { setEditTurno(t); setModalOpen(true); }}>✎</button>
                            <button className="btn-delete" title="Eliminar" onClick={() => handleEliminar(t.id)}>🗑</button>
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
      </div>
      {modalOpen && <TurnoModal turno={editTurno} onClose={() => setModalOpen(false)} onSave={cargarTurnos} />}
    </div>
  );
}