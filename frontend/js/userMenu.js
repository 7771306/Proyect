// frontend/js/userMenu.js

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("personToggle");
  const dropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (toggle && dropdown) {
    // Alternar visibilidad del menú
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    // Ocultar si haces clic afuera
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.replace("/index.html");
    });
  }
});
