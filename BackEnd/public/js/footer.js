const trigger = document.getElementById('owner-trigger');
const modal = document.getElementById('owner-modal');
const input = document.getElementById('owner-password');
const errorMsg = document.getElementById('owner-error');
const submitBtn = document.getElementById('owner-submit');
const cancelBtn = document.getElementById('owner-cancel');

trigger.addEventListener('click', () => {
    modal.classList.add('active');
    input.value = '';
    errorMsg.classList.remove('active');
    input.focus();
});

cancelBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

submitBtn.addEventListener('click', async () => {
    const password = input.value.trim();

    if (!password) return;

    try {
        const res = await fetch('/owner-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = data.url;
        } else {
            errorMsg.classList.add('active');
            input.value = '';
            input.focus();
        }
    } catch (error) {
        console.error('Error al verificar contraseña:', error);
        errorMsg.classList.add('active');
    }
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});