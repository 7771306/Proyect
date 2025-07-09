//frontend/js/app.js
(() => {

let libros = [];

const busquedaLibro = document.getElementById("search-input");
let contenedor = document.getElementById("contenedor-libros");

if (busquedaLibro && contenedor) {
  Promise.all([
    fetch("../pages/libro.json")
    .then(r => r.json()),
    fetch("/api/libros").then(r => r.json())
  ])
  .then(([estaticos, dinamicos]) => {
    const dinamicosAdaptados = dinamicos.map(libro => ({
      id: libro.id,
      title: libro.titulo,
      author: libro.autor,
      price: libro.precio,
      image: libro.imgen,
      category: libro.categoria,
      origen: "mysql"
    }));

    const estaticosAdaptados = estaticos.map(libro => ({
      ...libro,
      origen: "json"
    }));

    libros = [...estaticosAdaptados, ...dinamicosAdaptados];

    console.log("Total libros cargados:", libros.length);
  });

  busquedaLibro.addEventListener("input", () => {
    const filtro = busquedaLibro.value.trim().toLowerCase();
    console.log("Filtro activo:", filtro);

    contenedor.innerHTML = "";

    if (filtro === "") {
      contenedor.style.display = "none";
      return;
    }

    const filtrados = libros.filter(libro =>
      libro.title.toLowerCase().includes(filtro)
    );

    if (filtrados.length > 0) {
      contenedor.style.display = "flex";
      contenedor.style.flexDirection = "column";
      contenedor.style.gap = "5px";
      renderLibros(filtrados);
    } else {
      contenedor.style.display = "flex";
      contenedor.innerHTML = `<p>No se encontraron resultados.</p>`;
    }
  });

  function renderLibros(lista) {
    contenedor.innerHTML = "";

    lista.forEach(libro => {
      let imagenSrc = "";
      if (libro.image && libro.image.trim() !== "") {
        if (libro.image.startsWith("data:")) {
          imagenSrc = libro.image;
        } else if (libro.image.startsWith("/") || libro.image.startsWith("http")) {
          imagenSrc = libro.image;
        } else if (libro.image.includes("estilo/")) {
          imagenSrc = "/" + libro.image;
        } else {
          imagenSrc = "/imagenes/" + libro.image;
        }
      } else {
        imagenSrc = "/imagenes/placeholder.png";
      }

      const div = document.createElement("div");
      div.className = "libro-card";
      div.innerHTML = `
        <a href="libro.html?id=${libro.id}" class="libro-enlace">
          <img src="${imagenSrc}" alt="Portada" class="mini-portada" />
          <div class="libro-info">
            <span class="libro-titulo">${libro.title}</span>
            <span class="libro-autor">${libro.author}</span>
            <span class="libro-precio">$${libro.price}</span>
          </div>
        </a>
      `;
      contenedor.appendChild(div);
    });
  }

  document.addEventListener("click", e => {
  if (!contenedor.contains(e.target) && !busquedaLibro.contains(e.target)) {
    contenedor.style.display = "none";
  }
});


}

})(); // <== Cierra la función autoejecutable
