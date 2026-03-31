import { useNavigate } from 'react-router-dom';

export default function Servicios() {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={s.nav}>
        <span style={s.logo} onClick={() => navigate('/')}>NF</span>
        <div style={s.navLinks}>
          <button style={s.navLink} onClick={() => navigate('/')}>Inicio</button>
          <button style={s.navLink} onClick={() => navigate('/servicios')}>Servicios</button>
          <button style={s.navBtn} onClick={() => navigate('/reserva')}>Reservar</button>
        </div>
      </nav>

      {/* HEADER */}
      <section style={s.header}>
        <div style={s.headerDecor} />
        <p style={s.tag}>Lo que ofrezco</p>
        <h1 style={s.headerTitle}>Servicios</h1>
        <p style={s.headerDesc}>
          Cada persona es única. Por eso ofrezco distintas modalidades<br />
          de acompañamiento según tus necesidades.
        </p>
      </section>

      {/* SERVICIOS */}
      <section style={s.section}>

        {/* Primera Sesión */}
        <div style={s.card}>
          <div style={{ ...s.cardAccent, background: '#e8ddd0' }}>
            <span style={s.cardIcon}>🧍</span>
          </div>
          <div style={s.cardBody}>
            <span style={s.cardTag}>Inicio del proceso</span>
            <h2 style={s.cardTitle}>Primera Sesión</h2>
            <p style={s.cardDesc}>
              Una sesión para conocernos, explorar tu situación actual y definir
              juntos el camino a seguir. Es el punto de partida ideal si nunca
              fuiste a terapia o si venís de otro proceso y querés comenzar de nuevo.
            </p>
            <ul style={s.cardList}>
              <li>✓ Sin compromiso previo</li>
              <li>✓ Duración: 50 minutos</li>
              <li>✓ Presencial o virtual</li>
            </ul>
            <button style={s.cardBtn} onClick={() => navigate('/reserva')}>
              Reservar primera sesión →
            </button>
          </div>
        </div>

        {/* Individual */}
        <div style={{ ...s.card, flexDirection: 'row-reverse' as const }}>
          <div style={{ ...s.cardAccent, background: '#d4c5b0' }}>
            <span style={s.cardIcon}>🧠</span>
          </div>
          <div style={s.cardBody}>
            <span style={s.cardTag}>Más elegida</span>
            <h2 style={s.cardTitle}>Sesión Individual</h2>
            <p style={s.cardDesc}>
              Sesiones personalizadas con enfoque cognitivo-conductual. Trabajamos
              en profundidad tus emociones, pensamientos y comportamientos para
              lograr cambios reales y duraderos en tu vida.
            </p>
            <ul style={s.cardList}>
              <li>✓ Seguimiento continuo</li>
              <li>✓ Duración: 50 minutos</li>
              <li>✓ Presencial o virtual</li>
            </ul>
            <button style={s.cardBtn} onClick={() => navigate('/reserva')}>
              Reservar sesión individual →
            </button>
          </div>
        </div>

        {/* Grupal */}
        <div style={s.card}>
          <div style={{ ...s.cardAccent, background: '#c8b99a' }}>
            <span style={s.cardIcon}>👥</span>
          </div>
          <div style={s.cardBody}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={s.cardTag}>Grupal</span>
              <span style={s.discountBadge}>5% OFF</span>
            </div>
            <h2 style={s.cardTitle}>Sesiones Grupales</h2>
            <p style={s.cardDesc}>
              Espacios compartidos para crecer en grupo. Una experiencia
              enriquecedora donde el intercambio entre participantes potencia
              el proceso terapéutico individual.
            </p>
            <ul style={s.cardList}>
              <li>✓ Grupos reducidos (máx. 8 personas)</li>
              <li>✓ Duración: 90 minutos</li>
              <li>✓ Modalidad presencial</li>
            </ul>
            <button style={s.cardBtn} onClick={() => navigate('/reserva')}>
              Reservar sesión grupal →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={s.faq}>
        <p style={s.tag}>Preguntas frecuentes</p>
        <h2 style={s.faqTitle}>¿Tenés dudas?</h2>
        <div style={s.faqGrid}>
          {[
            { q: '¿Cómo son las sesiones virtuales?', a: 'Se realizan por videollamada (Meet o Zoom). La dinámica es igual a una sesión presencial.' },
            { q: '¿Con qué frecuencia se hacen las sesiones?', a: 'Generalmente una vez por semana, aunque puede variar según el proceso de cada persona.' },
            { q: '¿Cómo cancelo un turno?', a: 'Podés escribirme al mail con al menos 24hs de anticipación y lo reagendamos sin problema.' },
            { q: '¿Cuál es el costo de las sesiones?', a: 'Contactame por mail para consultar los valores actualizados según el tipo de sesión.' },
          ].map((item) => (
            <div key={item.q} style={s.faqItem}>
              <h4 style={s.faqQ}>{item.q}</h4>
              <p style={s.faqA}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <h2 style={s.ctaTitle}>¿Querés empezar?</h2>
        <p style={s.ctaDesc}>Reservá tu turno en minutos.</p>
        <button style={s.btnPrimary} onClick={() => navigate('/reserva')}>
          Reservar turno
        </button>
      </section>

      <footer style={s.footer}>
        <span style={s.logo}>NF</span>
        <p style={{ color: '#9a8a7a', fontSize: 13 }}>© 2026 Natalia Ferri · Psicología</p>
        <p style={{ color: '#9a8a7a', fontSize: 13 }}>nataliaferri832@gmail.com</p>
      </footer>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
`;

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: "'DM Sans', sans-serif", background: '#faf8f4', minHeight: '100vh', color: '#2a1f14' },

  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid #ede8e0', background: '#faf8f4', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#2a1f14', letterSpacing: 2, cursor: 'pointer' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 24 },
  navLink: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#5a4a3a', fontFamily: "'DM Sans', sans-serif" },
  navBtn: { background: '#2a1f14', color: '#faf8f4', border: 'none', borderRadius: 100, padding: '10px 22px', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

  header: { padding: '80px 48px 60px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden' },
  headerDecor: { position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #e8ddd0 0%, transparent 70%)', zIndex: 0 },
  tag: { fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#9a8a7a', marginBottom: 12, position: 'relative', zIndex: 1 },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 700, marginBottom: 20, color: '#2a1f14', position: 'relative', zIndex: 1 },
  headerDesc: { fontSize: 18, lineHeight: 1.7, color: '#5a4a3a', position: 'relative', zIndex: 1 },

  section: { maxWidth: 1000, margin: '0 auto', padding: '60px 48px', display: 'flex', flexDirection: 'column', gap: 48 },

  card: { display: 'flex', gap: 0, borderRadius: 28, overflow: 'hidden', border: '1px solid #ede8e0', background: '#fff' },
  cardAccent: { width: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardIcon: { fontSize: 56 },
  cardBody: { padding: '40px 40px', display: 'flex', flexDirection: 'column', gap: 12 },
  cardTag: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#9a8a7a', background: '#f2ece3', padding: '4px 12px', borderRadius: 100, width: 'fit-content' },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#2a1f14' },
  cardDesc: { fontSize: 15, lineHeight: 1.8, color: '#5a4a3a' },
  cardList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#5a4a3a' },
  cardBtn: { background: '#2a1f14', color: '#faf8f4', border: 'none', borderRadius: 100, padding: '12px 24px', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: 'fit-content', marginTop: 8 },
  discountBadge: { background: '#2a1f14', color: '#faf8f4', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100 },

  faq: { background: '#f2ece3', padding: '80px 48px', textAlign: 'center' as const },
  faqTitle: { fontFamily: "'Playfair Display', serif", fontSize: 40, marginBottom: 40, color: '#2a1f14' },
  faqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto', textAlign: 'left' as const },
  faqItem: { background: '#faf8f4', borderRadius: 20, padding: '28px 24px' },
  faqQ: { fontFamily: "'Playfair Display', serif", fontSize: 17, marginBottom: 10, color: '#2a1f14' },
  faqA: { fontSize: 14, lineHeight: 1.7, color: '#5a4a3a' },

  cta: { background: '#2a1f14', color: '#faf8f4', padding: '80px 48px', textAlign: 'center' as const },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: 44, marginBottom: 16, color: '#faf8f4' },
  ctaDesc: { fontSize: 17, color: '#c8b99a', marginBottom: 36 },
  btnPrimary: { background: '#faf8f4', color: '#2a1f14', border: 'none', borderRadius: 100, padding: '14px 32px', fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 },

  footer: { padding: '40px 48px', borderTop: '1px solid #ede8e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
};