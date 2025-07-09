//frontend/js/carrito-toggle.js
document.getElementById("carritoToggle").addEventListener("click", (e) => {
  e.preventDefault();
  const carrito = document.getElementById("carritoContainer");
  carrito.style.display = carrito.style.display === "none" ? "block" : "none";
});
