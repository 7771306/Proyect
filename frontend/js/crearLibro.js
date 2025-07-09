//frontend/js/crearLibro.js

const API_URL = "http://localhost:3000/api/libros";

const formulario = document.getElementById("form-libro");
const tabla = document.getElementById("tabla-libros");
const btnSubmit = formulario.querySelector("button[type='submit']");

let libroEditandoId = null;

document.addEventListener("DOMContentLoaded", () => {
  obtenerLibros();
  cargarCategorias(); // Solo cargamos categorías (autores es texto libre)
});

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const libro = {
    titulo: formulario.titulo.value,
    autor: formulario.autor.value, // Cambiado a texto directo (no parseInt)
    categoria_id: parseInt(formulario.categoria_id.value),
    año: formulario.año.value, // Cambiado a texto (no parseInt)
    imgen: formulario.imgen.value,
    stock: parseInt(formulario.stock.value),
    precio: parseFloat(formulario.precio.value),
  };

  try {
    let res;
    if (libroEditandoId) {
      res = await fetch(`${API_URL}/${libroEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(libro),
      });
    } else {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(libro),
      });
    }

    if (res.ok) {
      alert(libroEditandoId ? "✅ Libro actualizado" : "📚 Libro guardado");
      formulario.reset();
      btnSubmit.textContent = "Registrar";
      libroEditandoId = null;
      obtenerLibros();
    } else {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      alert("❌ Error: " + (error.message || error.error || "Error desconocido"));
    }
  } catch (error) {
    alert("❌ Error de conexión: " + error.message);
  }
});

async function obtenerLibros() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener libros");
    const libros = await res.json();
    
    tabla.innerHTML = libros.map(libro => `
      <tr>
        <td>${libro.id}</td>
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.categoria}</td>
        <td>${libro.año || "—"}</td>
        <td><img src="${libro.imgen || 'placeholder.jpg'}" alt="${libro.titulo}" style="width:60px; height:90px; object-fit:cover;"></td>
        <td>${libro.stock}</td>
        <td>$${Number(libro.precio).toFixed(2)}</td>
        <td>
          <button onclick="editarLibro(${libro.id})">Editar</button>
          <button onclick="eliminarLibro(${libro.id})">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error("Error:", error);
    tabla.innerHTML = `<tr><td colspan="9">Error al cargar libros: ${error.message}</td></tr>`;
  }
}

window.eliminarLibro = async function (id) {
  if (confirm("¿Estás seguro de eliminar este libro?")) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      obtenerLibros();
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  }
};

window.editarLibro = async function (id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("No se pudo cargar el libro");
    const libro = await res.json();

    formulario.titulo.value = libro.titulo;
    formulario.autor.value = libro.autor; // Texto directo
    formulario.categoria_id.value = libro.categoria_id;
    formulario.año.value = libro.año;
    formulario.imgen.value = libro.imgen || '';
    formulario.stock.value = libro.stock;
    formulario.precio.value = libro.precio;

    libroEditandoId = id;
    btnSubmit.textContent = "Actualizar";
  } catch (error) {
    alert("❌ Error al cargar libro: " + error.message);
  }
};

async function cargarCategorias() {
  try {
    const res = await fetch(`${API_URL}/categorias/lista`);
    if (!res.ok) throw new Error("Error al cargar categorías");
    const categorias = await res.json();
    
    const select = formulario.categoria_id;
    select.innerHTML = `
      <option disabled selected value="">Seleccione una categoría</option>
      ${categorias.map(cat => `
        <option value="${cat.id}">${cat.nombre}</option>
      `).join('')}
    `;
  } catch (error) {
    console.error("Error cargando categorías:", error);
  }
}
