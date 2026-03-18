import { Request, Response } from "express";
import { SesionPersonalizada } from "../database/models/sesiones_personalizadas";

export class SesionesPersonalizadasController {

  // Obtener todas las sesiones activas (PUBLICO)
  async getSesionesPublicas(req: Request, res: Response): Promise<Response> {
    try {

      await SesionPersonalizada.sync();

      const sesiones = await SesionPersonalizada.findAll({
        where: { activo: true },
        order: [["id", "DESC"]],
      });

      return res.status(200).json({
        message: "Sesiones obtenidas correctamente",
        data: sesiones,
      });

    } catch (error) {
      console.error("Error en getSesionesPublicas:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // Obtener una sesión por ID (PUBLICO)
  async getSesionById(req: Request, res: Response): Promise<Response> {
    try {

      await SesionPersonalizada.sync();

      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const sesion = await SesionPersonalizada.findByPk(id);

      if (!sesion) {
        return res.status(404).json({
          message: "Sesion no encontrada",
        });
      }

      return res.status(200).json({
        message: "Sesion obtenida correctamente",
        data: sesion,
      });

    } catch (error) {
      console.error("Error en getSesionById:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // Crear sesión (ADMIN)
  async createSesion(req: Request, res: Response): Promise<Response> {
    try {

      await SesionPersonalizada.sync();

      const { titulo, texto, imagen_url, activo } = req.body;

      const nuevaSesion = await SesionPersonalizada.create({
        titulo,
        texto,
        imagen_url,
        activo,
      });

      return res.status(201).json({
        message: "Sesion creada correctamente",
        data: nuevaSesion,
      });

    } catch (error) {
      console.error("Error en createSesion:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // Actualizar sesión (ADMIN)
  async updateSesion(req: Request, res: Response): Promise<Response> {
    try {

      await SesionPersonalizada.sync();

      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const sesion = await SesionPersonalizada.findByPk(id);

      if (!sesion) {
        return res.status(404).json({
          message: "Sesion no encontrada",
        });
      }

      await sesion.update(req.body);

      return res.status(200).json({
        message: "Sesion actualizada correctamente",
        data: sesion,
      });

    } catch (error) {
      console.error("Error en updateSesion:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // Eliminar sesión (ADMIN)
  async deleteSesion(req: Request, res: Response): Promise<Response> {
    try {

      await SesionPersonalizada.sync();

      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const sesion = await SesionPersonalizada.findByPk(id);

      if (!sesion) {
        return res.status(404).json({
          message: "Sesion no encontrada",
        });
      }

      await sesion.destroy();

      return res.status(200).json({
        message: "Sesion eliminada correctamente",
      });

    } catch (error) {
      console.error("Error en deleteSesion:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

}

export default new SesionesPersonalizadasController();