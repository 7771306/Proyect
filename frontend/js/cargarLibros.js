// frontend/js/cargarLibros.js
function cargarLibros(categoriaId, elementoId) {
    const contenedor = document.getElementById(elementoId);
    
    // Limpiar el contenedor primero
    contenedor.innerHTML = '';
    
    fetch(`/api/libros/categoria/${categoriaId}`)
      .then(res => res.json())
      .then(data => {
        let productRow = document.createElement('div');
        productRow.className = 'product-row';
        
        data.forEach((libro, index) => {
            // Cada 3 libros, creamos una nueva fila
            if (index % 3 === 0 && index !== 0) {
                contenedor.appendChild(productRow);
                productRow = document.createElement('div');
                productRow.className = 'product-row';
            }
            
            // Crear elemento del libro
            const div = document.createElement('div');
            div.className = 'product-item';
            div.innerHTML = `
                <a href="libro.html?id=${libro.id}">
                    <img src="${libro.imgen || '../estilo/default-book.png'}" alt="${libro.titulo}" class="portda">
                </a>
                <div class="product-txt">
                    <h3>${formatearTitulo(libro.titulo)}</h3>
                    <p class="escritor">${libro.autor}</p>
                    <p class="precio">$${libro.precio.toLocaleString()}</p>
                    <a href="#" class="agregar-carrito btn-2" data-id="${libro.id}"></a>
                </div>
            `;
            
            productRow.appendChild(div);
        });
        
        // Añadir la última fila si tiene elementos
        if (productRow.children.length > 0) {
            contenedor.appendChild(productRow);
        }
        
        // Inicializar eventos del carrito para los nuevos elementos
        inicializarCarrito();
      })
      .catch(error => {
          console.error('Error al cargar libros:', error);
          contenedor.innerHTML = '<p>Error al cargar los libros. Intente nuevamente.</p>';
      });
}

// Función auxiliar para formatear el título (primera letra mayúscula, resto minúsculas)
function formatearTitulo(titulo) {
    return titulo.toLowerCase()
                .split(' ')
                .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                .join(' ');
}

// Función para inicializar eventos del carrito (asegúrate de tener esta función en carrito.js)
function inicializarCarrito() {
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const libroId = this.getAttribute('data-id');
            agregarAlCarrito(libroId); // Esta función debe estar en carrito.js
        });
    });
}