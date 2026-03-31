import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTurnosOcupados, reservarTurno } from '../api/turnos';

const HORAS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const TIPO_SESION = [
  { value: 'primera_sesion', label: 'Primera Sesión', desc: 'Para conocernos', icon: '🧍' },
  { value: 'individual', label: 'Sesión Individual', desc: 'Proceso personalizado', icon: '🧠' },
  { value: 'grupal', label: 'Sesión Grupal', desc: 'En grupo · 5% OFF', icon: '👥' },
];

type Step = 1 | 2 | 3 | 4;

export default function Reserva() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  const [tipoSesion, setTipoSesion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const cargarHorasOcupadas = async (fechaSeleccionada: string) => {
    const mes = fechaSeleccionada.slice(0, 7);
    try {
      const res = await getTurnosOcupados(mes);
      const ocupadas = res.data.ocupados
        .filter((t: any) => t.fecha === fechaSeleccionada)
        .map((t: any) => t.hora.slice(0, 5));
      setHorasOcupadas(ocupadas);
    } catch {
      setHorasOcupadas([]);
    }
  };

  const handleFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFecha(val);
    setHora('');
    if (val) cargarHorasOcupadas(val);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await reservarTurno({ fecha, hora, nombre, email, telefono, tipo_sesion: tipoSesion as any });
      setExito(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Ocurrió un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  if (exito) {
    return (
      <div style={s.page}>
        <style>{css}</style>
        <div style={s.exitoWrap}>
          <div style={s.exitoCard}>
            <span style={{ fontSize: 56 }}>✅</span>
            <h2 style={s.exitoTitle}>¡Turno reservado!</h2>
            <p style={s.exitoDesc}>
              Te enviamos una confirmación a <strong>{email}</strong>.<br />
              Natalia se pondrá en contacto con vos pronto.
            </p>
            <div style={s.exitoInfo}>
              <span>📅 {fecha}</span>
              <span>🕐 {hora} hs</span>
              <span>🧩 {TIPO_SESION.find(t => t.value === tipoSesion)?.label}</span>
            </div>
            <button style={s.btnPrimary} onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={s.nav}>
        <span style={s.logo} onClick={() => navigate('/')}>NF</span>
        <div style={s.navLinks}>
          <button style={s.navLink} onClick={() => navigate('/')}>Inicio</button>
          <button style={s.navLink} onClick={() => navigate('/servicios')}>Servicios</button>
        </div>
      </nav>

      <div style={s.container}>
        {/* HEADER */}
        <div style={s.header}>
          <p style={s.tag}>Reserva online</p>
          <h1 style={s.title}>Reservá tu turno</h1>
          <p style={s.subtitle}>Simple, rápido y sin llamadas.</p>
        </div>

        {/* STEPS INDICATOR */}
        <div style={s.steps}>
          {['Tipo de sesión', 'Fecha y hora', 'Tus datos', 'Confirmar'].map((label, i) => {
            const n = (i + 1) as Step;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} style={s.stepItem}>
                <div style={{ ...s.stepCircle, background: done ? '#2a1f14' : active ? '#5a4a3a' : '#ede8e0', color: done || active ? '#faf8f4' : '#9a8a7a' }}>
                  {done ? '✓' : n}
                </div>
                <span style={{ ...s.stepLabel, color: active ? '#2a1f14' : '#9a8a7a', fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* FORM */}
        <div style={s.formCard}>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 style={s.stepTitle}>¿Qué tipo de sesión necesitás?</h2>
              <div style={s.tipoGrid}>
                {TIPO_SESION.map((t) => (
                  <div
                    key={t.value}
                    style={{ ...s.tipoCard, ...(tipoSesion === t.value ? s.tipoCardActive : {}) }}
                    onClick={() => setTipoSesion(t.value)}
                  >
                    <span style={{ fontSize: 36 }}>{t.icon}</span>
                    <strong style={{ fontSize: 16, marginTop: 8 }}>{t.label}</strong>
                    <span style={{ fontSize: 13, color: '#9a8a7a' }}>{t.desc}</span>
                  </div>
                ))}
              </div>
              <div style={s.formActions}>
                <div />
                <button style={{ ...s.btnPrimary, opacity: tipoSesion ? 1 : 0.4 }} disabled={!tipoSesion} onClick={() => setStep(2)}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 style={s.stepTitle}>Elegí fecha y horario</h2>
              <div style={s.campo}>
                <label style={s.label}>Fecha</label>
                <input type="date" style={s.input} value={fecha} min={hoy} onChange={handleFecha} />
              </div>
              {fecha && (
                <div style={s.campo}>
                  <label style={s.label}>Horario disponible</label>
                  <div style={s.horasGrid}>
                    {HORAS.map((h) => {
                      const ocupada = horasOcupadas.includes(h);
                      const seleccionada = hora === h;
                      return (
                        <button
                          key={h}
                          disabled={ocupada}
                          onClick={() => setHora(h)}
                          style={{
                            ...s.horaBtn,
                            ...(ocupada ? s.horaBtnOcupada : {}),
                            ...(seleccionada ? s.horaBtnActiva : {}),
                          }}
                        >
                          {h} hs{ocupada ? ' ✗' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={s.formActions}>
                <button style={s.btnSecondary} onClick={() => setStep(1)}>← Atrás</button>
                <button style={{ ...s.btnPrimary, opacity: fecha && hora ? 1 : 0.4 }} disabled={!fecha || !hora} onClick={() => setStep(3)}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 style={s.stepTitle}>Tus datos</h2>
              <div style={s.campo}>
                <label style={s.label}>Nombre completo *</label>
                <input style={s.input} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: María García" />
              </div>
              <div style={s.campo}>
                <label style={s.label}>Email *</label>
                <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
              </div>
              <div style={s.campo}>
                <label style={s.label}>Teléfono (opcional)</label>
                <input style={s.input} value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+54 11 1234-5678" />
              </div>
              <div style={s.formActions}>
                <button style={s.btnSecondary} onClick={() => setStep(2)}>← Atrás</button>
                <button style={{ ...s.btnPrimary, opacity: nombre && email ? 1 : 0.4 }} disabled={!nombre || !email} onClick={() => setStep(4)}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 style={s.stepTitle}>Confirmá tu reserva</h2>
              <div style={s.resumenCard}>
                {[
                  { icon: '🧩', label: 'Tipo', value: TIPO_SESION.find(t => t.value === tipoSesion)?.label },
                  { icon: '📅', label: 'Fecha', value: fecha },
                  { icon: '🕐', label: 'Hora', value: `${hora} hs` },
                  { icon: '👤', label: 'Nombre', value: nombre },
                  { icon: '📧', label: 'Email', value: email },
                  ...(telefono ? [{ icon: '📱', label: 'Teléfono', value: telefono }] : []),
                ].map((item) => (
                  <div key={item.label} style={s.resumenRow}>
                    <span>{item.icon} <strong>{item.label}</strong></span>
                    <span style={{ color: '#5a4a3a' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              {error && <p style={s.errorMsg}>{error}</p>}
              <div style={s.formActions}>
                <button style={s.btnSecondary} onClick={() => setStep(3)}>← Atrás</button>
                <button style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }} disabled={loading} onClick={handleSubmit}>
                  {loading ? 'Reservando...' : 'Confirmar reserva ✓'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }
`;

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: "'DM Sans', sans-serif", background: '#faf8f4', minHeight: '100vh', color: '#2a1f14' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid #ede8e0', background: '#faf8f4', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#2a1f14', letterSpacing: 2, cursor: 'pointer' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 24 },
  navLink: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#5a4a3a', fontFamily: "'DM Sans', sans-serif" },

  container: { maxWidth: 720, margin: '0 auto', padding: '60px 24px' },
  header: { textAlign: 'center', marginBottom: 48 },
  tag: { fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#9a8a7a', marginBottom: 12 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 700, marginBottom: 12 },
  subtitle: { fontSize: 17, color: '#5a4a3a' },

  steps: { display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 40, flexWrap: 'wrap' },
  stepItem: { display: 'flex', alignItems: 'center', gap: 8 },
  stepCircle: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  stepLabel: { fontSize: 13 },

  formCard: { background: '#fff', borderRadius: 28, padding: '44px 40px', border: '1px solid #ede8e0' },
  stepTitle: { fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 28 },

  tipoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 },
  tipoCard: { border: '2px solid #ede8e0', borderRadius: 20, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  tipoCardActive: { border: '2px solid #2a1f14', background: '#f2ece3' },

  campo: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#2a1f14' },
  input: { width: '100%', padding: '12px 16px', border: '1.5px solid #ede8e0', borderRadius: 12, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', background: '#faf8f4' },

  horasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 },
  horaBtn: { padding: '10px 8px', border: '1.5px solid #ede8e0', borderRadius: 10, fontSize: 13, cursor: 'pointer', background: '#faf8f4', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  horaBtnOcupada: { background: '#f4f4f4', color: '#ccc', cursor: 'not-allowed', textDecoration: 'line-through' },
  horaBtnActiva: { background: '#2a1f14', color: '#faf8f4', border: '1.5px solid #2a1f14' },

  resumenCard: { background: '#f2ece3', borderRadius: 16, padding: '24px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 },
  resumenRow: { display: 'flex', justifyContent: 'space-between', fontSize: 15, borderBottom: '1px solid #e8ddd0', paddingBottom: 10 },

  formActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 },
  btnPrimary: { background: '#2a1f14', color: '#faf8f4', border: 'none', borderRadius: 100, padding: '14px 28px', fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
  btnSecondary: { background: 'transparent', color: '#2a1f14', border: '1.5px solid #2a1f14', borderRadius: 100, padding: '14px 28px', fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

  errorMsg: { color: '#ef4444', fontSize: 14, marginBottom: 16, background: '#fff5f5', padding: '12px 16px', borderRadius: 10 },

  exitoWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  exitoCard: { background: '#fff', borderRadius: 28, padding: '56px 40px', textAlign: 'center', maxWidth: 480, border: '1px solid #ede8e0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  exitoTitle: { fontFamily: "'Playfair Display', serif", fontSize: 36 },
  exitoDesc: { fontSize: 16, color: '#5a4a3a', lineHeight: 1.7 },
  exitoInfo: { display: 'flex', gap: 20, background: '#f2ece3', borderRadius: 14, padding: '16px 24px', fontSize: 14, flexWrap: 'wrap', justifyContent: 'center' },
};