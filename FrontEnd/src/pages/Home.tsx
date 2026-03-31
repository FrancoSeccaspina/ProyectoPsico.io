import { useState, useEffect } from 'react';
import '../css/home.css';

const API_BASE = 'http://localhost:3033';

type EstadoTurno = 'pendiente' | 'confirmado' | 'cancelado';
type TipoSesion  = 'primera_sesion' | 'individual' | 'grupal';

interface Turno {
  id: number;
  fecha: string;
  hora: string;
  tipo_sesion: TipoSesion;
  nombre: string;
  email: string;
  telefono?: string | null;
  estado: EstadoTurno;
  created_at: string;
}

interface ModalProps {
  turno?: Turno | null;
  onClose: () => void;
  onSave: () => void;
}

const TIPO_LABEL: Record<TipoSesion, string> = {
  primera_sesion: 'Primera sesión',
  individual:     'Individual',
  grupal:         'Grupal',
};

function TurnoModal({ turno, onClose, onSave }: ModalProps): React.ReactElement {
  const isEdit = !!turno;
  const [form, setForm] = useState({
    nombre:      turno?.nombre           ?? '',
    email:       turno?.email            ?? '',
    telefono:    turno?.telefono         ?? '',
    fecha:       turno?.fecha            ?? '',
    hora:        turno?.hora?.slice(0,5) ?? '',
    tipo_sesion: turno?.tipo_sesion      ?? 'primera_sesion',
    estado:      turno?.estado           ?? 'pendiente',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!form.nombre || !form.email || !form.fecha || !form.hora) {
      setError('Completá todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url    = isEdit
        ? `${API_BASE}/api/turnos/${turno!.id}`
        : `${API_BASE}/api/turnos`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al guardar');
      onSave();
      onClose();
    } catch {
      setError('No se pudo guardar el turno. Verificá la conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Editar Turno' : 'Nuevo Turno'}</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-box">{error}</div>}

          <label className="form-label">Nombre completo *</label>
          <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: María García" />

          <label className="form-label">Email *</label>
          <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />

          <label className="form-label">Teléfono</label>
          <input className="form-input" name="telefono" value={form.telefono ?? ''} onChange={handleChange} placeholder="+54 11 1234-5678" />

          <div className="form-grid-2">
            <div>
              <label className="form-label">Fecha *</label>
              <input className="form-input" name="fecha" type="date" value={form.fecha} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Hora *</label>
              <input className="form-input" name="hora" type="time" value={form.hora} onChange={handleChange} />
            </div>
          </div>

          <label className="form-label">Tipo de sesión *</label>
          <select className="form-input" name="tipo_sesion" value={form.tipo_sesion} onChange={handleChange}>
            <option value="primera_sesion">Primera sesión</option>
            <option value="individual">Individual</option>
            <option value="grupal">Grupal</option>
          </select>

          <label className="form-label">Estado</label>
          <select className="form-input" name="estado" value={form.estado} onChange={handleChange}>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear turno'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home(): React.ReactElement {
  const [turnos,       setTurnos]       = useState<Turno[]>([]);
  const [loading,      setLoading]      = useState<boolean>(true);
  const [fetchError,   setFetchError]   = useState<string>('');
  const [modalOpen,    setModalOpen]    = useState<boolean>(false);
  const [editTurno,    setEditTurno]    = useState<Turno | null>(null);
  const [deleteId,     setDeleteId]     = useState<number | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [searchNombre, setSearchNombre] = useState<string>('');

  const fetchTurnos = async (): Promise<void> => {
    setLoading(true);
    setFetchError('');
    try {
      const res  = await fetch(`${API_BASE}/api/turnos/todos`);
      const json = await res.json();
      setTurnos(Array.isArray(json) ? json : (json.data ?? []));
    } catch {
      setFetchError('No se pudo conectar con la API. Verificá que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTurnos(); }, []);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await fetch(`${API_BASE}/api/turnos/${id}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchTurnos();
    } catch {
      alert('Error al eliminar el turno.');
    }
  };

  const handleCambiarEstado = async (id: number, estado: EstadoTurno): Promise<void> => {
    try {
      await fetch(`${API_BASE}/api/turnos/${id}/estado`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ estado }),
      });
      fetchTurnos();
    } catch {
      alert('Error al cambiar el estado.');
    }
  };

  const filtered = turnos.filter((t: Turno) => {
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

  const statsData = [
    { label: 'Total turnos',  value: counts.total,      className: 'stat-total',      icon: '📋' },
    { label: 'Pendientes',    value: counts.pendiente,  className: 'stat-pendiente',  icon: '⏳' },
    { label: 'Confirmados',   value: counts.confirmado, className: 'stat-confirmado', icon: '✅' },
    { label: 'Cancelados',    value: counts.cancelado,  className: 'stat-cancelado',  icon: '❌' },
  ];

  const filterOptions = [
    { label: 'Todos',      value: 'todos'      },
    { label: 'Pendiente',  value: 'pendiente'  },
    { label: 'Confirmado', value: 'confirmado' },
    { label: 'Cancelado',  value: 'cancelado'  },
  ];

  return (
    <div className="home-page">
      <div className="bg-blob-1" />
      <div className="bg-blob-2" />

      <div className="home-container">

        {/* Bienvenida */}
        <div className="welcome-card">
          <div>
            <p className="welcome-sub">Panel de administración</p>
            <h1 className="welcome-title">
              Bienvenida, <span className="name-highlight">Natalia Ferri</span> 👋
            </h1>
            <p className="welcome-desc">Gestioná todos los turnos desde este panel.</p>
          </div>
          <div className="welcome-date">
            <span className="date-text">
              {new Date().toLocaleDateString('es-AR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {statsData.map((stat) => (
            <div key={stat.label} className={`stat-card ${stat.className}`}>
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tabla ABM */}
        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Detalle de Turnos</h2>
            <button className="btn-primary" onClick={() => { setEditTurno(null); setModalOpen(true); }}>
              + Nuevo turno
            </button>
          </div>

          <div className="filters-row">
            <input
              className="form-input search-input"
              placeholder="Buscar por nombre..."
              value={searchNombre}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchNombre(e.target.value)}
            />
            <div className="filter-btns">
              {filterOptions.map(({ label, value }) => (
                <button
                  key={value}
                  className={`filter-btn ${filterEstado === value ? 'filter-btn--active' : ''}`}
                  onClick={() => setFilterEstado(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="center-msg">
              <div className="spinner" />
              <p className="center-msg-text">Cargando turnos...</p>
            </div>
          ) : fetchError ? (
            <div className="center-msg">
              <p className="error-text">{fetchError}</p>
              <button className="btn-secondary" onClick={fetchTurnos}>Reintentar</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="center-msg">
              <p className="empty-icon">📭</p>
              <p className="center-msg-text">No hay turnos para mostrar.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="reservas-table">
                <thead>
                  <tr>
                    {['ID','Nombre','Email','Teléfono','Fecha','Hora','Tipo','Estado','Creado','Acciones'].map(h => (
                      <th key={h} className="table-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t: Turno, i: number) => (
                    <tr key={t.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                      <td className="table-td"><span className="id-badge">#{t.id}</span></td>
                      <td className="table-td td-nombre">{t.nombre}</td>
                      <td className="table-td td-email">{t.email}</td>
                      <td className="table-td">{t.telefono || <span className="no-data">—</span>}</td>
                      <td className="table-td">{new Date(t.fecha).toLocaleDateString('es-AR')}</td>
                      <td className="table-td">{t.hora.slice(0,5)} hs</td>
                      <td className="table-td">
                        <span className={`tipo-badge tipo-${t.tipo_sesion}`}>
                          {TIPO_LABEL[t.tipo_sesion]}
                        </span>
                      </td>
                      <td className="table-td">
                        <select
                          className={`estado-select estado-${t.estado}`}
                          value={t.estado}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleCambiarEstado(t.id, e.target.value as EstadoTurno)
                          }
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="table-td td-date">
                        {new Date(t.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td className="table-td">
                        <div className="action-btns">
                          <button className="btn-action btn-edit"   title="Editar"    onClick={() => { setEditTurno(t); setModalOpen(true); }}>✎</button>
                          <button className="btn-action btn-delete" title="Eliminar"  onClick={() => setDeleteId(t.id)}>🗑</button>
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

      {modalOpen && (
        <TurnoModal
          turno={editTurno}
          onClose={() => setModalOpen(false)}
          onSave={fetchTurnos}
        />
      )}

      {deleteId !== null && (
        <div className="overlay" onClick={() => setDeleteId(null)}>
          <div className="modal modal--sm" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Confirmar eliminación</span>
            </div>
            <div className="modal-confirm-body">
              <p className="confirm-text">
                ¿Estás segura de que querés eliminar el turno{' '}
                <strong className="confirm-id">#{deleteId}</strong>?
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancelar</button>
              <button className="btn-primary btn-danger" onClick={() => handleDelete(deleteId)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}