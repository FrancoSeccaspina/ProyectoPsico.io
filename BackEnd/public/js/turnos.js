const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const HORAS = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'];

let cur      = new Date();
cur.setDate(1);

let ocupados = [];
let selDate  = null;
let selHora  = null;

/* ================= HELPERS ================= */

function padMes(m){
  return String(m + 1).padStart(2,'0');
}

function mesKey(){
  return `${cur.getFullYear()}-${padMes(cur.getMonth())}`;
}

function isOcupado(fecha, hora){
  return ocupados.some(o => o.fecha === fecha && o.hora.slice(0,5) === hora);
}

/* ================= DATA ================= */

async function cargarOcupados(){
  try {
    const res  = await fetch(`/api/turnos?mes=${mesKey()}`);
    const data = await res.json();
    ocupados   = data.ocupados || [];
  } catch(e){
    ocupados = [];
  }

  renderCal();
}

/* ================= CALENDARIO ================= */

function renderCal(){
  const cal = document.getElementById('cal');
  cal.innerHTML = '';

  // Headers días
  DIAS.forEach(d => {
    const h = document.createElement('div');
    h.className = 'day-header';
    h.textContent = d;
    cal.appendChild(h);
  });

  const y = cur.getFullYear();
  const m = cur.getMonth();

  document.getElementById('month-label').textContent = `${MESES[m]} ${y}`;

  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date();

  // Espacios vacíos
  for(let i = 0; i < firstDow; i++){
    const e = document.createElement('div');
    e.className = 'day-cell empty';
    cal.appendChild(e);
  }

  // Días
  for(let d = 1; d <= daysInMonth; d++){
    const cell = document.createElement('div');
    const dow  = new Date(y, m, d).getDay();

    const isPast  = new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isWeek  = dow === 0 || dow === 6;
    const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();

    const fechaStr = `${y}-${padMes(m)}-${String(d).padStart(2,'0')}`;

    const hasFree = !isPast && !isWeek && HORAS.some(h => !isOcupado(fechaStr, h));
    const isSel   = selDate === fechaStr;

    let cls = 'day-cell';
    if(isPast)  cls += ' past';
    if(isWeek)  cls += ' weekend';
    if(isToday) cls += ' today';
    if(isSel)   cls += ' selected';

    cell.className = cls;
    cell.innerHTML = d;

    if(hasFree){
      const dot = document.createElement('span');
      dot.className = 'dot';
      cell.appendChild(dot);
    }

    if(!isPast && !isWeek){
      cell.onclick = () => selectDay(fechaStr, d, m);
    }

    cal.appendChild(cell);
  }
}

/* ================= SELECCION DIA ================= */

function selectDay(fechaStr, d, m){
  selDate = fechaStr;
  selHora = null;

  renderCal();
  renderSlots(fechaStr, d, m);

  document.getElementById('form-card').style.display = 'none';
  clearAlert();
}

/* ================= HORARIOS ================= */

function renderSlots(fechaStr, d, m){
  const card  = document.getElementById('slots-card');
  const title = document.getElementById('slots-title');
  const div   = document.getElementById('slots');

  card.style.display = 'block';
  title.textContent  = `Horarios disponibles — ${d} de ${MESES[m]}`;

  div.innerHTML = '';

  HORAS.forEach(h => {
    const btn = document.createElement('button'); // 🔥 FIX

    const tomado = isOcupado(fechaStr, h);

    btn.className = 'slot';
    btn.textContent = `${h} hs`;

    if(tomado){
      btn.classList.add('taken');
      btn.disabled = true;
    }

    if(selHora === h){
      btn.classList.add('selected-slot');
    }

    if(!tomado){
      btn.onclick = () => selectHora(h);
    }

    div.appendChild(btn);
  });
}

/* ================= SELECCION HORA ================= */

function selectHora(h){
  selHora = h;

  renderSlots(selDate, selDate.split('-')[2], new Date(selDate).getMonth());

  const form = document.getElementById('form-card');
  form.style.display = 'block';

  form.scrollIntoView({
    behavior: 'smooth',
    block: 'center' // 🔥 mejor UX
  });
}

/* ================= CONFIRMAR ================= */

document.getElementById('confirm-btn').onclick = async () => {
  const nombre      = document.getElementById('inp-nombre').value.trim();
  const email       = document.getElementById('inp-email').value.trim();
  const telefono    = document.getElementById('inp-tel').value.trim();
  const tipoSesion  = document.getElementById('inp-tipo').value;

  if(!nombre || !email){
    showAlert('Por favor completá nombre y email.', 'error');
    return;
  }

  if(!tipoSesion){
    showAlert('Por favor seleccioná el tipo de sesión.', 'error');
    return;
  }

  if(!selDate || !selHora){
    showAlert('Seleccioná un día y horario.', 'error');
    return;
  }

  const btn = document.getElementById('confirm-btn');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const res = await fetch('/api/turnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fecha: selDate,
        hora: selHora,
        nombre,
        email,
        telefono: telefono || null,
        tipo_sesion: tipoSesion,
      }),
    });

    const data = await res.json();

    if(!res.ok){
      showAlert(data.error || 'Ocurrió un error.', 'error');
      return;
    }

    showAlert(`¡Turno confirmado! ${nombre} — ${selDate} a las ${selHora} hs`, 'success');

    ocupados.push({ fecha: selDate, hora: `${selHora}:00` });

    // Reset
    selDate = null;
    selHora = null;

    renderCal();

    document.getElementById('slots-card').style.display = 'none';
    document.getElementById('form-card').style.display  = 'none';

    document.getElementById('inp-nombre').value = '';
    document.getElementById('inp-email').value  = '';
    document.getElementById('inp-tel').value    = '';
    document.getElementById('inp-tipo').value   = '';

  } catch(e){
    showAlert('Error de conexión.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirmar turno';
  }
};

/* ================= ALERTAS ================= */

function showAlert(msg, type){
  const box = document.getElementById('alert-box');

  box.textContent = msg;
  box.className   = `alert ${type}`;
  box.style.display = 'block';

  box.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

function clearAlert(){
  const box = document.getElementById('alert-box');
  box.style.display = 'none';
  box.className = 'alert';
}

/* ================= NAVEGACION ================= */

document.getElementById('prev').onclick = () => {
  cur.setMonth(cur.getMonth() - 1);
  resetUI();
  cargarOcupados();
};

document.getElementById('next').onclick = () => {
  cur.setMonth(cur.getMonth() + 1);
  resetUI();
  cargarOcupados();
};

function resetUI(){
  selDate = null;
  selHora = null;

  document.getElementById('slots-card').style.display = 'none';
  document.getElementById('form-card').style.display  = 'none';
}

/* ================= INIT ================= */

cargarOcupados();