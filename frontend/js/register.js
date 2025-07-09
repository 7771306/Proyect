// frontend/js/register.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const cerrarRegistro = document.getElementById('cerrarRegistro');
    const mostrarLogin = document.getElementById('mostrarLogin');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo-reg').value;
            const contraseña = document.getElementById('contraseña').value;
            const id_rol = document.getElementById('rol').value;

            const res = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, correo, contraseña, id_rol })
            });

            const data = await res.json();
            alert(data.message);
            if (res.status === 201) window.location.href = '/index.html';
        });
    }

    if (cerrarRegistro && registerForm) {
        cerrarRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
        });
    }

    if (mostrarLogin && loginForm && registerForm) {
        mostrarLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }
});
