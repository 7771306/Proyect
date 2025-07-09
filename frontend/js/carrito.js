//frontend/js/carrito.js

const API_URL = 'http://localhost:3000/api/libros';
const VENTAS_API_URL = 'http://localhost:3000/api/ventas';

// Simulación de usuario logueado
const ID_USUARIO = 1;

// Si tienes un contenedor de catálogo en index.html
const container = document.getElementById('libros-container');
if (container) {
  fetch(API_URL)
    .then(res => res.json())
    .then(libros => {
      libros.forEach(p => {
        const card = document.createElement('div');
        card.innerHTML = `
          <img src="${p.imagen_url}" width="100">
          <h3>${p.titulo}</h3>
          <p>Precio: $${p.precio}</p>
          <button onclick='agregarAlCarrito(${JSON.stringify(p)})'>Agregar</button>
        `;
        container.appendChild(card);
      });
    });
}

// =============== Carrito desplegable en index.html ==================
document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('carritoTabla');
  const totalSpan = document.getElementById('totalCarrito');
  const confirmarBtn = document.getElementById('confirmarBtn');
  const cartPopup = document.getElementById('carritoContainer');
  const cartToggle = document.getElementById('carritoToggle');


  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  function mostrarCarrito() {
    tabla.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
      const fila = document.createElement('tr');
      fila.innerHTML = `<td colspan="5">Tu carrito está vacío.</td>`;
      tabla.appendChild(fila);
    } else {
      carrito.forEach((item, index) => {
        const subtotal = item.price * item.cantidad;
        total += subtotal;

        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${item.title}</td>
          <td>$${item.price.toLocaleString()}</td>
          <td>${item.cantidad}</td>
          <td>$${subtotal.toLocaleString()}</td>
          <td><button data-index="${index}" class="eliminar-btn">Eliminar</button></td>
        `;
        tabla.appendChild(fila);
      });
    }

    totalSpan.textContent = total.toLocaleString();
  }

  // Mostrar/Ocultar carrito al picar el ícono
  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      cartPopup.style.display = cartPopup.style.display === 'none' ? 'block' : 'none';
      mostrarCarrito();
    });
  }

  // Eliminar productos
  tabla.addEventListener('click', (e) => {
    if (e.target.classList.contains('eliminar-btn')) {
      const index = e.target.dataset.index;
      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      mostrarCarrito();
    }
  });

  // Confirmar compra
  confirmarBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    // Aquí puedes pedir correo o método de pago si quieres
    const correo = prompt('Ingrese su correo electrónico:');
    const metodo_pago = prompt('Ingrese el método de pago (ejemplo: Tarjeta, Efectivo):');

    if (!metodo_pago) {
      alert('Debe ingresar un método de pago.');
      return;
    }

    const venta = {
      usuario_id: ID_USUARIO,
      metodo_pago,
      correo,
      libros: carrito.map(p => ({
        id_libro: p.id,
        cantidad: p.cantidad,
        precio_unitario: p.price
      }))
    };

    fetch(VENTAS_API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(venta)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Error al registrar la venta: ' + data.error);
          return;
        }
        alert(`¡Venta registrada con éxito! ID: ${data.id_venta}, Total: $${data.total}`);
        carrito = [];
        localStorage.removeItem('carrito');
        mostrarCarrito();
        cartPopup.style.display = 'none';
      })
      .catch(err => {
        console.error('Error al procesar la venta:', err);
        alert('Error al procesar la venta.');
      });
  });

  // Mostrar carrito al cargar
  mostrarCarrito();
});

// =============== Función global para agregar productos ==============
function agregarAlCarrito(libro) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const existe = carrito.find(item => item.id === libro.id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({
      id: libro.id,
      title: libro.title,
      price: libro.discount
        ? Math.round(libro.price * (1 - libro.discount / 100))
        : libro.price,
      cantidad: 1
    });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`"${libro.title}" ha sido añadido al carrito.`);
}
