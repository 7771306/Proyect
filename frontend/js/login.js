// frontend/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const personIcon = document.querySelector('.person');
    const registerForm = document.getElementById('registerForm');
    const mostrarRegistro = document.getElementById('mostrarRegistro');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correo = document.getElementById('correo').value;
            const contraseña = document.getElementById('contraseña').value;

            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contraseña })
            });

            const data = await res.json();
            if (res.status === 200) {
                // Guardar datos de sesión
                localStorage.setItem('rol', data.rol);
                localStorage.setItem('correo', correo);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirección basada en rol
                if (data.rol === 2 || data.rol === '2' || data.rol === 'cliente') {
    window.location.href = 'cliente.html';
} else if (data.rol === 1 || data.rol === '1' || data.rol === 'admin') {
    window.location.href = 'admin.html';
} else {
                    alert('Rol no reconocido');
                }
            } else {
                alert(data.message);
            }
        });

        // Cerrar formularios al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!loginForm.contains(e.target) &&
                personIcon && !personIcon.contains(e.target) &&
                registerForm && !registerForm.contains(e.target)) {
                loginForm.classList.remove('active');
                registerForm.classList.remove('active');
            }
        });
    }

    if (personIcon && loginForm && registerForm) {
        personIcon.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.toggle('active');
            registerForm.classList.remove('active');
        });
    }

    if (mostrarRegistro && loginForm && registerForm) {
        mostrarRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });
    }
});
