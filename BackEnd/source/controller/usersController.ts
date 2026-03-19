import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import { Usuario } from "../database/models/usuario.js";
import { Autenticacion } from "../database/models/autenticacion.js";

export class UsuarioController {

  // Obtener todos los usuarios (SOLO ACTIVOS)
  async getUsuarios(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await Usuario.findAll({
        where: { activo: true }, // <--- FILTRO AUTOMÁTICO
        include: {
          model: Autenticacion,
          as: 'autenticacion',
          attributes: ["email"],
        },
      });

      return res.status(200).json({
        success: true,
        message: "Usuarios activos obtenidos correctamente",
        data: usuarios,
      });
    } catch (error) {
      console.error("Error en getUsuarios:", (error as Error).message);
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }

  // Obtener usuario por ID (Solo si está activo)
  async getUsuarioById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

      const usuario = await Usuario.findOne({
        where: { id, activo: true }, // <--- FILTRO DE SEGURIDAD
        include: { model: Autenticacion, as: 'autenticacion', attributes: ["email"] },
      });

      if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado o inactivo" });

      return res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }

  // Crear usuario (Por defecto activo: true según modelo)
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

      const nuevoUsuario = await Usuario.create({
        nombre,
        apellido,
        email,
        celular,
        dni,
        aclaracion,
        activo: true // Aseguramos que inicie activo
      }, { transaction });

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

  // Actualizar usuario
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

  // SOFT DELETE: Borrado lógico por ID y Nombre
  async deleteUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const { nombre } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      // Validación de seguridad por nombre (ignorando mayúsculas/minúsculas)
      if (usuario.nombre.toLowerCase() !== nombre?.toLowerCase()) {
        return res.status(400).json({ 
          success: false, 
          message: "El nombre no coincide con el registro del sistema" 
        });
      }

      await usuario.update({ activo: false }); 

      return res.status(200).json({
        success: true,
        message: `El usuario ${usuario.nombre} ${usuario.apellido} ha sido desactivado`,
      });

    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al procesar la baja" });
    }
  }
}

export default new UsuarioController();