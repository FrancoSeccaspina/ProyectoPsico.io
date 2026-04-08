document.addEventListener("DOMContentLoaded", () => {
  cargarTopico();
  configurarBotonVolver();
});

/* =========================
   🔹 CARGAR TÓPICO
========================= */
async function cargarTopico() {
  try {
    const slug = window.location.pathname.split('/').pop();

    const res = await fetch(`/api/topicos/${slug}`);
    const contenedor = document.getElementById('topico-detalle');

    if (!contenedor) return;

    if (res.status === 404) {
      contenedor.innerHTML = '<h2>No encontrado</h2>';
      return;
    }

    const t = await res.json();

    contenedor.innerHTML = `
  <img src="${t.imagen_url || '/img/default.jpg'}" alt="${t.titulo}">
  
  <div class="contenido-wrapper">
    <h1>${t.titulo}</h1>
    <p class="contenido">${t.contenido}</p>
  </div>
`;

  } catch (error) {
    console.error('Error cargando tópico:', error);
  }
}

/* =========================
   🔹 BOTÓN VOLVER
========================= */
function configurarBotonVolver() {
  const btn = document.querySelector('.back');

  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    // Si hay historial → vuelve atrás
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // fallback seguro
      window.location.href = '/topicos';
    }
  });
}