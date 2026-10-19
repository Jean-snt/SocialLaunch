class UploadController {
  /**
   * Endpoint POST /api/upload
   * Sube una imagen, la procesa a WebP con Sharp y retorna la URL pública
   */
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No se envió ningún archivo de imagen para procesar",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Imagen procesada y convertida a WebP exitosamente",
        data: {
          filename: req.file.filename,
          url: req.file.fileUrl,
          mimetype: req.file.mimetype,
          format: req.file.format,
          size: req.file.size,
          width: req.file.width,
          height: req.file.height,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
