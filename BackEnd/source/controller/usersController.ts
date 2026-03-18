import { Request, Response } from "express";
import { Usuario } from "../database/models/usuario";
import { Autenticacion } from "../database/models/autenticacion";

export class UsuarioController {

  // Obtener todos los usuarios
  async getUsuarios(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await Usuario.findAll({
        include: {
          model: Autenticacion,
          attributes: ["email"],
        },
      });

      return res.status(200).json({
        message: "Usuarios obtenidos correctamente",
        data: usuarios,
      });

    } catch (error) {
      console.error("Error en getUsuarios:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // Obtener usuario por ID
  async getUsuarioById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const usuario = await Usuario.findByPk(id, {
        include: {
          model: Autenticacion,
          attributes: ["email"],
        },
      });

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        message: "Usuario obtenido correctamente",
        data: usuario,
      });

    } catch (error) {
      console.error("Error en getUsuarioById:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // Crear usuario
  async createUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { nombre, apellido, email, celular, dni, aclaracion } = req.body;

      const usuarioExistente = await Usuario.findOne({
        where: { email },
      });

      if (usuarioExistente) {
        return res.status(400).json({
          message: "El email ya está registrado",
        });
      }

      const nuevoUsuario = await Usuario.create({
        nombre,
        apellido,
        email,
        celular,
        dni,
        aclaracion,
      });

      return res.status(201).json({
        message: "Usuario creado correctamente",
        data: nuevoUsuario,
      });

    } catch (error) {
      console.error("Error en createUsuario:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // Actualizar usuario
  async updateUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      await usuario.update(req.body);

      return res.status(200).json({
        message: "Usuario actualizado correctamente",
        data: usuario,
      });

    } catch (error) {
      console.error("Error en updateUsuario:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // Eliminar usuario
  async deleteUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      await usuario.destroy();

      return res.status(200).json({
        message: "Usuario eliminado correctamente",
      });

    } catch (error) {
      console.error("Error en deleteUsuario:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
}

export default new UsuarioController();
