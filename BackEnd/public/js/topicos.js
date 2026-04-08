document.addEventListener("DOMContentLoaded", () => {
  cargarTopicos();
});

async function cargarTopicos() {
  try {
    const res = await fetch('/api/topicos');
    const topicos = await res.json();

    const container = document.getElementById('topicos-container');
    container.innerHTML = '';

    if (!topicos.length) {
      container.innerHTML = '<p>No hay tópicos disponibles</p>';
      return;
    }

    topicos.forEach(t => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <img src="${t.imagen_url || '/img/default.jpg'}" alt="${t.titulo}">
        <div class="card-body">
          <h2>${t.titulo}</h2>
          <p>${t.resenia}</p>
          <a href="/topicos/${t.slug}" class="btn">Leer más</a>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error cargando tópicos:', error);
  }
}