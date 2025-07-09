//backend/routes/libros.routes.js

import { Router } from "express";
import * as controller from "../controllers/libros.controller.js";
import { getLibrosPorCategoria } from "../controllers/libros.controller.js";

const router = Router();

// ✅ Ruta para obtener categorías (la única lista que necesitamos)
router.get("/categorias/lista", controller.getCategorias);

// ✅ Ruta para obtener un libro por ID (antes que "/")
router.get("/:id", controller.obtenerLibroPorId);

router.get("/categoria/:categoriaId", getLibrosPorCategoria);
// ✅ Rutas CRUD básicas
router.get("/", controller.getLibros);
router.post("/", controller.createLibro);
router.put("/:id", controller.updateLibro);
router.delete("/:id", controller.deleteLibro);

export default router;
