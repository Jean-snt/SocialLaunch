const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Carpeta de destino de uploads
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de Multer para almacenar en memoria (Buffer) y poder procesar con Sharp
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/avif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato no compatible. Solo se permiten imágenes (JPEG, PNG, WEBP, GIF, SVG, AVIF)."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite máximo de 10 MB antes del procesamiento
  },
  fileFilter,
});

/**
 * Middleware para procesar la imagen con Sharp:
 * - Conversión obligatoria a formato .webp
 * - Redimensionamiento max 1920px (responsive) sin deformar
 * - Compresión de calidad balanceada (80%) para ultra velocidad
 */
const processImageWithSharp = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const originalBaseName = path
      .parse(fileOriginalNameClean(req.file.originalname))
      .name.replace(/[^a-zA-Z0-9_-]/g, "_");

    const webpFilename = `${originalBaseName}_${uniqueSuffix}.webp`;
    const outputPath = path.join(uploadsDir, webpFilename);

    // Procesamiento con Sharp
    const processedBuffer = await sharp(req.file.buffer)
      .resize({
        width: 1920,
        height: 1920,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 4,
      })
      .toFile(outputPath);

    // Metadata adjunta al objeto req.file
    req.file.filename = webpFilename;
    req.file.path = outputPath;
    req.file.mimetype = "image/webp";
    req.file.format = "webp";
    req.file.size = processedBuffer.size;
    req.file.width = processedBuffer.width;
    req.file.height = processedBuffer.height;
    req.file.fileUrl = `/uploads/${webpFilename}`;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al procesar y convertir la imagen a WebP con Sharp",
      error: error.message,
    });
  }
};

function fileOriginalNameClean(name) {
  return name ? name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "image";
}

module.exports = {
  upload,
  processImageWithSharp,
};
