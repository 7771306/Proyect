//frontend/js/libro.js
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const libroId = params.get("id");

  if (!libroId) {
    console.error("No se proporcionó ID de libro");
    window.location.href = "/index.html";
    return;
  }

  // Cargar datos de ambas fuentes
  Promise.all([
    fetch("/pages/libro.json").then(res => res.json()),
    fetch("/api/libros").then(res => res.json())
  ])
  .then(([estaticos, dinamicos]) => {
    // Adaptar dinámicos
    const dinamicosAdaptados = dinamicos.map(libro => ({
      id: String(libro.id),
      title: libro.titulo,
      author: libro.autor,
      price: libro.precio,
      image: libro.imgen || libro.image || "/imagenes/placeholder.png",
      description: libro.descripcion || "Sin descripción.",
      discount: libro.descuento || 0
    }));

    // Asegurar descuento en estáticos
    const estaticosAdaptados = estaticos.map(libro => ({
      ...libro,
      discount: libro.discount || 0,
      image: libro.image ? (libro.image.startsWith("/") ? libro.image : `/${libro.image}`) : "/imagenes/placeholder.png"
    }));

    const todos = [...estaticosAdaptados, ...dinamicosAdaptados];
    const libro = todos.find(l => String(l.id) === libroId);

    if (!libro) {
      console.error("Libro no encontrado");
      document.querySelector(".book-info").innerHTML = "Libro no encontrado.";
      return;
    }

    // Cambiar título
    document.title = `${libro.title} | Tu Librería`;

    // Mostrar datos
    document.getElementById("book-title").textContent = libro.title;
    document.getElementById("book-author").textContent = libro.author;

    // Formatear descripción en párrafos
    const descripcionElement = document.getElementById("book-description");
    const parrafos = libro.description.split("\n");
    descripcionElement.innerHTML = parrafos.map(p => `<p>${p}</p>`).join("");

    // Imagen
    document.getElementById("book-image").src = libro.image;

    // Precios
    if (libro.discount > 0) {
      document.getElementById("discount-badge").textContent = `-${libro.discount}%`;
      const discountedPrice = Math.round(libro.price * (1 - libro.discount / 100));
      document.getElementById("current-price").textContent = `$${discountedPrice.toLocaleString()}`;
      document.getElementById("original-price").textContent = `$${libro.price.toLocaleString()}`;
    } else {
      document.getElementById("discount-badge").style.display = "none";
      document.getElementById("original-price").style.display = "none";
      document.getElementById("current-price").textContent = `$${libro.price.toLocaleString()}`;
    }

    // Botón añadir al carrito
    const botonAgregar = document.getElementById("add-to-cart-btn");
    botonAgregar.addEventListener("click", () => {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const existente = carrito.find(item => item.id === libro.id);

      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push({
          id: libro.id,
          title: libro.title,
          price: libro.discount > 0 ? Math.round(libro.price * (1 - libro.discount / 100)) : libro.price,
          cantidad: 1
        });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`"${libro.title}" ha sido añadido al carrito.`);
    });

  })
  .catch(error => {
    console.error("Error cargando datos:", error);
    document.getElementById("book-title").textContent = "Error cargando el libro.";
  });
});
