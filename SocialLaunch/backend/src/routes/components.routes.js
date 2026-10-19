const { Router } = require("express");
const componentsController = require("../controllers/components.controller");
const { verifyAuth, verifyRole } = require("../middlewares/auth.middleware");

// mergeParams: true permite acceder a :pageId definido en la ruta padre
const router = Router({ mergeParams: true });

// GET /api/pages/:pageId/components: Listar componentes de la página (público para vitrina y admin)
router.get("/", componentsController.getComponents);

// GET /api/pages/:pageId/components/:componentId: Obtener un componente específico por ID (público)
router.get("/:componentId", componentsController.getComponentById);

// POST /api/pages/:pageId/components: Crear nuevo bloque (requiere admin)
router.post("/", verifyAuth, verifyRole(["admin"]), componentsController.createComponent);

// PUT /api/pages/:pageId/components/reorder: Reordenar bloques en lote (requiere admin)
router.put("/reorder", verifyAuth, verifyRole(["admin"]), componentsController.reorderComponents);

// PUT /api/pages/:pageId/components/:componentId: Actualizar bloque existente (requiere admin)
router.put("/:componentId", verifyAuth, verifyRole(["admin"]), componentsController.updateComponent);

// DELETE /api/pages/:pageId/components/:componentId: Eliminar bloque (requiere admin)
router.delete("/:componentId", verifyAuth, verifyRole(["admin"]), componentsController.deleteComponent);

module.exports = router;
