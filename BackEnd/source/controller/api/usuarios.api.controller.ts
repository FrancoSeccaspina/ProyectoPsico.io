import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import { Usuario } from "../../database/models/usuario.js";
import { Autenticacion } from "../../database/models/autenticacion.js";

export class UsuarioController {

  // 1. OBTENER TODOS (Solo los que no están "borrados")
  async getUsuarioById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "ID inválido" });
      }

      const usuario = await Usuario.findOne({
        where: { id, activo: true },
        include: { 
          model: Autenticacion, 
          as: 'autenticacion', 
          attributes: ["email"] 
        },
      });

      if (usuario) {
        return res.status(200).json({
          success: true,
          message: "Usuario encontrado",
          data: usuario,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado o inactivo",
      });
    } catch (error) {
      console.error("Error en getUsuarioById:", (error as Error).message);
      return res.status(500).json({ 
        success: false, 
        message: "Error interno del servidor" 
      });
    }
  }

  // Listar TODOS (incluyendo inactivos) - Útil para panel de admin
  async getUsuarios(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await Usuario.findAll({
        include: { model: Autenticacion, as: 'autenticacion', attributes: ["email"] },
      });

      return res.status(200).json({
        success: true,
        message: "Historial completo de usuarios obtenido",
        data: usuarios,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error interno" });
    }
  }

  // 3. REGISTRAR (Crea usuario con activo = true por defecto)
  async createUsuario(req: Request, res: Response): Promise<Response> {
    const transaction = await Usuario.sequelize?.transaction();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { nombre, apellido, email, celular, dni, aclaracion, contrasenia } = req.body;

      const existente = await Autenticacion.findOne({ where: { email } });
      if (existente) {
        return res.status(400).json({ success: false, message: "El email ya está registrado" });
      }

      // Crear el perfil del usuario
      const nuevoUsuario = await Usuario.create({
        nombre,
        apellido,
        email,
        celular,
        dni,
        aclaracion,
        activo: true 
      }, { transaction });

      // Crear la autenticación
      const hashedPassword = await bcrypt.hash(contrasenia, 10);
      await Autenticacion.create({
        email,
        password_hash: hashedPassword,
        id_usuario: nuevoUsuario.id
      }, { transaction });

      await transaction?.commit();

      return res.status(201).json({
        success: true,
        message: "Usuario registrado con éxito",
        data: nuevoUsuario
      });

    } catch (error) {
      if (transaction) await transaction.rollback();
      return res.status(500).json({ success: false, message: "Error al registrar usuario" });
    }
  }

  // 4. ACTUALIZAR (Solo si está activo)
  async updateUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const usuario = await Usuario.findOne({ where: { id, activo: true } });

      if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

      await usuario.update(req.body);

      return res.status(200).json({
        success: true,
        message: "Datos actualizados correctamente",
        data: usuario
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al actualizar" });
    }
  }

  // 5. BORRADO LÓGICO (Soft Delete)
  async deleteUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const { nombre } = req.body; 

      if (!nombre) {
        return res.status(400).json({ success: false, message: "Falta el nombre para confirmar" });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

      // Validación de nombre para evitar borrados accidentales
      if (usuario.nombre.toLowerCase() !== nombre.toLowerCase()) {
        return res.status(400).json({ 
          success: false, 
          message: "El nombre no coincide con el ID. Operación cancelada." 
        });
      }

      // Cambiamos el estado en lugar de destruir el registro
      await usuario.update({ activo: false });

      return res.status(200).json({ 
        success: true, 
        message: `Usuario ${usuario.nombre} desactivado (borrado lógico) correctamente` 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al procesar la baja" });
    }
  }
}

export default new UsuarioController();