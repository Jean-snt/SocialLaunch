const { Router } = require("express");
const pagesController = require("../controllers/pages.controller");
const componentsController = require("../controllers/components.controller");
const { verifyAuth, verifyRole } = require("../middlewares/auth.middleware");

const router = Router();

// GET /api/pages: Listar todas las campañas (público)
router.get("/", pagesController.getAllPages);

// POST /api/pages: Crear nueva landing de campaña (admin)
router.post("/", verifyAuth, verifyRole(["admin"]), pagesController.createPage);

// GET /api/pages/:identifier: Obtener campaña por ID o slug (público)
router.get("/:identifier", pagesController.getPage);

// PUT /api/pages/:id: Actualizar metadatos o estado de publicación (admin)
router.put("/:id", verifyAuth, verifyRole(["admin"]), pagesController.updatePage);

// POST /api/pages/:id/duplicate: Duplicar campaña con todos sus bloques (admin)
router.post("/:id/duplicate", verifyAuth, verifyRole(["admin"]), pagesController.duplicatePage);

// DELETE /api/pages/:id: Eliminar campaña y sus componentes (admin)
router.delete("/:id", verifyAuth, verifyRole(["admin"]), pagesController.deletePage);

// Subrutas de componentes anidadas bajo /api/pages/:pageId/components
router.get("/:pageId/components", componentsController.getComponents);
router.get("/:pageId/components/:componentId", componentsController.getComponentById);
router.post("/:pageId/components", verifyAuth, verifyRole(["admin"]), componentsController.createComponent);
router.put("/:pageId/components/reorder", verifyAuth, verifyRole(["admin"]), componentsController.reorderComponents);
router.put("/:pageId/components/:componentId", verifyAuth, verifyRole(["admin"]), componentsController.updateComponent);
router.delete("/:pageId/components/:componentId", verifyAuth, verifyRole(["admin"]), componentsController.deleteComponent);

module.exports = router;
