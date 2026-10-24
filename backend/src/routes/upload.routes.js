const { Router } = require("express");
const uploadController = require("../controllers/upload.controller");
const { upload, processImageWithSharp } = require("../middlewares/upload.middleware");
const { verifyAuth, verifyRole } = require("../middlewares/auth.middleware");

const router = Router();

// POST /api/upload: Sube y procesa una imagen a formato .webp con Sharp
router.post(
  "/",
  verifyAuth,
  verifyRole(["admin"]),
  upload.single("image"),
  processImageWithSharp,
  uploadController.uploadImage
);

module.exports = router;
