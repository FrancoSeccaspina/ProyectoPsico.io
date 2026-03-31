import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = document.querySelectorAll('.fade-in');
    els.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 0.15}s`;
      el.classList.add('visible');
    });
  }, []);

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={s.nav}>
        <span style={s.logo}>NF</span>
        <div style={s.navLinks}>
          <button style={s.navLink} onClick={() => navigate('/servicios')}>Servicios</button>
          <button style={s.navLink} onClick={() => navigate('/reserva')}>Turnos</button>
          <button style={s.navBtn} onClick={() => navigate('/reserva')}>Reservar</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero} ref={heroRef}>
        <div style={s.heroDecor} />
        <div style={s.heroContent}>
          <p className="fade-in" style={s.heroTag}>Psicología · Buenos Aires</p>
          <h1 className="fade-in" style={s.heroTitle}>
            Un espacio<br />para vos.
          </h1>
          <p className="fade-in" style={s.heroDesc}>
            Acompañamiento psicológico personalizado.<br />
            Sesiones individuales, grupales y primera consulta.
          </p>
          <div className="fade-in" style={s.heroBtns}>
            <button style={s.btnPrimary} onClick={() => navigate('/reserva')}>
              Reservar turno
            </button>
            <button style={s.btnSecondary} onClick={() => navigate('/servicios')}>
              Ver servicios
            </button>
          </div>
        </div>
        <div className="fade-in" style={s.heroVisual}>
          <div style={s.heroCircle}>
            <span style={s.heroInitials}>NF</span>
          </div>
          <div style={s.heroFloatCard}>
            <span style={{ fontSize: 22 }}>🧠</span>
            <span style={{ fontSize: 13, color: '#5a4a3a' }}>+200 sesiones realizadas</span>
          </div>
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section style={s.about}>
        <div style={s.aboutInner}>
          <div style={s.aboutText}>
            <p style={s.sectionTag}>Sobre mí</p>
            <h2 style={s.sectionTitle}>Natalia Ferri</h2>
            <p style={s.aboutDesc}>
              Soy psicóloga clínica con enfoque en terapia cognitivo-conductual.
              Mi objetivo es crear un espacio seguro y contenedor donde puedas
              explorar tus emociones, trabajar tus dificultades y crecer como persona.
            </p>
            <p style={s.aboutDesc}>
              Atiendo de forma presencial y virtual, adaptándome a tus necesidades
              y tiempos.
            </p>
          </div>
          <div style={s.aboutCards}>
            {[
              { icon: '🎓', label: 'Lic. en Psicología', sub: 'UBA' },
              { icon: '💬', label: 'TCC', sub: 'Enfoque principal' },
              { icon: '📍', label: 'Buenos Aires', sub: 'Presencial y virtual' },
            ].map((c) => (
              <div key={c.label} style={s.aboutCard}>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                <strong style={{ fontSize: 14 }}>{c.label}</strong>
                <span style={{ fontSize: 12, color: '#9a8a7a' }}>{c.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS PREVIEW */}
      <section style={s.services}>
        <p style={s.sectionTag}>Servicios</p>
        <h2 style={s.sectionTitle}>¿Cómo puedo ayudarte?</h2>
        <div style={s.serviceCards}>
          {[
            { icon: '🧍', title: 'Primera Sesión', desc: 'Una sesión para conocernos y explorar tus necesidades.', tag: 'Inicio' },
            { icon: '🧠', title: 'Sesión Individual', desc: 'Sesiones personalizadas basadas en tus objetivos.', tag: 'Popular' },
            { icon: '👥', title: 'Sesiones Grupales', desc: 'Espacios compartidos para crecer en grupo. 5% OFF.', tag: 'Grupal' },
          ].map((s_) => (
            <div key={s_.title} className="service-card" style={s.serviceCard}>
              <span style={{ fontSize: 36, marginBottom: 12 }}>{s_.icon}</span>
              <span style={s.serviceCardTag}>{s_.tag}</span>
              <h3 style={s.serviceCardTitle}>{s_.title}</h3>
              <p style={s.serviceCardDesc}>{s_.desc}</p>
              <button style={s.serviceCardBtn} onClick={() => navigate('/servicios')}>
                Conocer más →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <h2 style={s.ctaTitle}>¿Listo para dar el primer paso?</h2>
        <p style={s.ctaDesc}>Reservá tu turno en minutos, de forma simple y segura.</p>
        <button style={s.btnPrimary} onClick={() => navigate('/reserva')}>
          Reservar turno ahora
        </button>
      </section>

      {/* FOOTER */}
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
  body { background: #faf8f4; }

  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  .service-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(90,74,58,0.12) !important;
  }
`;

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: "'DM Sans', sans-serif", background: '#faf8f4', minHeight: '100vh', color: '#2a1f14' },

  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid #ede8e0', background: '#faf8f4', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#2a1f14', letterSpacing: 2 },
  navLinks: { display: 'flex', alignItems: 'center', gap: 24 },
  navLink: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#5a4a3a', fontFamily: "'DM Sans', sans-serif" },
  navBtn: { background: '#2a1f14', color: '#faf8f4', border: 'none', borderRadius: 100, padding: '10px 22px', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

  hero: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 48px', minHeight: '88vh', position: 'relative', overflow: 'hidden' },
  heroDecor: { position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #e8ddd0 0%, transparent 70%)', zIndex: 0 },
  heroContent: { maxWidth: 560, zIndex: 1 },
  heroTag: { fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: '#9a8a7a', marginBottom: 20 },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: 72, lineHeight: 1.1, fontWeight: 700, marginBottom: 24, color: '#2a1f14' },
  heroDesc: { fontSize: 18, lineHeight: 1.7, color: '#5a4a3a', marginBottom: 36 },
  heroBtns: { display: 'flex', gap: 14 },
  heroVisual: { zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 },
  heroCircle: { width: 300, height: 300, borderRadius: '50%', background: 'linear-gradient(135deg, #e8ddd0, #d4c5b0)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #c8b99a' },
  heroInitials: { fontFamily: "'Playfair Display', serif", fontSize: 72, color: '#5a4a3a', fontStyle: 'italic' },
  heroFloatCard: { background: '#fff', borderRadius: 16, padding: '14px 20px', boxShadow: '0 8px 32px rgba(90,74,58,0.12)', display: 'flex', alignItems: 'center', gap: 10 },

  btnPrimary: { background: '#2a1f14', color: '#faf8f4', border: 'none', borderRadius: 100, padding: '14px 28px', fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
  btnSecondary: { background: 'transparent', color: '#2a1f14', border: '1.5px solid #2a1f14', borderRadius: 100, padding: '14px 28px', fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

  about: { padding: '80px 48px', background: '#f2ece3' },
  aboutInner: { maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 60, alignItems: 'flex-start', flexWrap: 'wrap' },
  aboutText: { flex: 1, minWidth: 280 },
  aboutDesc: { fontSize: 16, lineHeight: 1.8, color: '#5a4a3a', marginBottom: 16 },
  aboutCards: { display: 'flex', flexDirection: 'column', gap: 16 },
  aboutCard: { background: '#faf8f4', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14, minWidth: 240 },

  sectionTag: { fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#9a8a7a', marginBottom: 12 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, marginBottom: 32, color: '#2a1f14' },

  services: { padding: '80px 48px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' as const },
  serviceCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 8 },
  serviceCard: { background: '#fff', borderRadius: 24, padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' as const, border: '1px solid #ede8e0', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default' },
  serviceCardTag: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#9a8a7a', background: '#f2ece3', padding: '4px 12px', borderRadius: 100, marginBottom: 14 },
  serviceCardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 12, color: '#2a1f14' },
  serviceCardDesc: { fontSize: 14, color: '#5a4a3a', lineHeight: 1.7, marginBottom: 24 },
  serviceCardBtn: { background: 'none', border: 'none', color: '#2a1f14', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

  cta: { background: '#2a1f14', color: '#faf8f4', padding: '80px 48px', textAlign: 'center' as const },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: 44, marginBottom: 16, color: '#faf8f4' },
  ctaDesc: { fontSize: 17, color: '#c8b99a', marginBottom: 36 },

  footer: { padding: '40px 48px', borderTop: '1px solid #ede8e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
};