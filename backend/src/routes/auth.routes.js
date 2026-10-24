const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { verifyAuth } = require("../middlewares/auth.middleware");

const router = Router();

// Rutas de autenticación
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", verifyAuth, authController.me);

module.exports = router;
