import { useEffect, useState } from 'react';
import { getTodosLosTurnos, cambiarEstado, eliminarTurno, editarTurno } from '../../api/turnos';

interface Turno {
  id: number;
  fecha: string;
  hora: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo_sesion: 'primera_sesion' | 'individual' | 'grupal';
  estado: 'pendiente' | 'confirmado' | 'cancelado';
}

const TIPO_LABEL: Record<string, string> = {
  primera_sesion: 'Primera Sesión',
  individual: 'Individual',
  grupal: 'Grupal',
};

const ESTADO_COLORS: Record<string, string> = {
  pendiente: '#f59e0b',
  confirmado: '#10b981',
  cancelado: '#ef4444',
};

export default function AdminPanel() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Turno | null>(null);

  const cargarTurnos = async () => {
    try {
      const res = await getTodosLosTurnos();
      setTurnos(res.data);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const handleEstado = async (id: number, estado: string) => {
    try {
      await cambiarEstado(id, estado);
      cargarTurnos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que querés eliminar este turno?')) return;
    try {
      await eliminarTurno(id);
      cargarTurnos();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleGuardarEdicion = async () => {
    if (!editando) return;
    try {
      await editarTurno(editando.id, {
        nombre: editando.nombre,
        email: editando.email,
        telefono: editando.telefono,
        fecha: editando.fecha,
        hora: editando.hora,
        tipo_sesion: editando.tipo_sesion,
        estado: editando.estado,
      });
      setEditando(null);
      cargarTurnos();
    } catch (error) {
      console.error('Error al editar:', error);
    }
  };

  if (loading) return <div style={styles.loading}>Cargando turnos...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Panel de Administración</h1>
      <p style={styles.subtitulo}>{turnos.length} turnos en total</p>

      <div style={styles.tabla}>
        {/* Header */}
        <div style={styles.headerRow}>
          <span>Paciente</span>
          <span>Fecha</span>
          <span>Hora</span>
          <span>Tipo</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {turnos.length === 0 && (
          <div style={styles.vacio}>No hay turnos registrados</div>
        )}

        {turnos.map((turno) => (
          <div key={turno.id} style={styles.row}>
            <div>
              <strong>{turno.nombre}</strong>
              <br />
              <small style={{ color: '#888' }}>{turno.email}</small>
              {turno.telefono && (
                <>
                  <br />
                  <small style={{ color: '#888' }}>{turno.telefono}</small>
                </>
              )}
            </div>
            <span>{turno.fecha}</span>
            <span>{turno.hora.slice(0, 5)} hs</span>
            <span>{TIPO_LABEL[turno.tipo_sesion]}</span>
            <span style={{ color: ESTADO_COLORS[turno.estado], fontWeight: 600 }}>
              {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
            </span>
            <div style={styles.acciones}>
              {turno.estado === 'pendiente' && (
                <button style={styles.btnConfirmar} onClick={() => handleEstado(turno.id, 'confirmado')}>
                  ✓ Confirmar
                </button>
              )}
              {turno.estado !== 'cancelado' && (
                <button style={styles.btnCancelar} onClick={() => handleEstado(turno.id, 'cancelado')}>
                  ✗ Cancelar
                </button>
              )}
              <button style={styles.btnEditar} onClick={() => setEditando(turno)}>
                ✎ Editar
              </button>
              <button style={styles.btnEliminar} onClick={() => handleEliminar(turno.id)}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {editando && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={{ marginBottom: 20 }}>Editar Turno</h2>

            {[
              { label: 'Nombre', key: 'nombre' },
              { label: 'Email', key: 'email' },
              { label: 'Teléfono', key: 'telefono' },
              { label: 'Fecha', key: 'fecha' },
              { label: 'Hora', key: 'hora' },
            ].map(({ label, key }) => (
              <div key={key} style={styles.campo}>
                <label style={styles.label}>{label}</label>
                <input
                  style={styles.input}
                  value={(editando as any)[key] || ''}
                  onChange={(e) => setEditando({ ...editando, [key]: e.target.value })}
                />
              </div>
            ))}

            <div style={styles.campo}>
              <label style={styles.label}>Tipo de Sesión</label>
              <select
                style={styles.input}
                value={editando.tipo_sesion}
                onChange={(e) => setEditando({ ...editando, tipo_sesion: e.target.value as any })}
              >
                <option value="primera_sesion">Primera Sesión</option>
                <option value="individual">Individual</option>
                <option value="grupal">Grupal</option>
              </select>
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>Estado</label>
              <select
                style={styles.input}
                value={editando.estado}
                onChange={(e) => setEditando({ ...editando, estado: e.target.value as any })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button style={styles.btnConfirmar} onClick={handleGuardarEdicion}>
                Guardar
              </button>
              <button style={styles.btnCancelar} onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 16px', fontFamily: 'sans-serif' },
  titulo: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  subtitulo: { color: '#888', marginBottom: 24 },
  loading: { textAlign: 'center', padding: 80, fontSize: 18 },
  tabla: { border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' },
  headerRow: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 2fr',
    padding: '12px 16px', background: '#f4f4f8', fontWeight: 700, fontSize: 13,
    borderBottom: '1px solid #e5e5e5',
  },
  row: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 2fr',
    padding: '14px 16px', borderBottom: '1px solid #f0f0f0',
    alignItems: 'center', fontSize: 14,
  },
  vacio: { padding: 40, textAlign: 'center', color: '#aaa' },
  acciones: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  btnConfirmar: { background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12 },
  btnCancelar: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12 },
  btnEditar: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12 },
  btnEliminar: { background: '#f4f4f8', border: '1px solid #e5e5e5', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480 },
  campo: { marginBottom: 14 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
};