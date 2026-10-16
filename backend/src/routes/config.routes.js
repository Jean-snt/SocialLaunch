const { Router } = require("express");
const configController = require("../controllers/config.controller");
const { verifyAuth, verifyRole } = require("../middlewares/auth.middleware");

const router = Router();

// GET /api/config: Público para inyección SSR en Next.js
router.get("/", configController.getConfig);

// PUT /api/config: Protegido con JWT y rol admin
router.put("/", verifyAuth, verifyRole(["admin"]), configController.updateConfig);

module.exports = router;
