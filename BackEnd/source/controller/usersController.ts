import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
// MAL: import { Usuario } from '../database/models/usuario.js';
// BIEN:
import { Usuario, Autenticacion } from '../database/models/index.js';

export class UsuarioController {

  // Obtener todos los usuarios (SOLO ACTIVOS)
async getUsuarios(req: Request, res: Response): Promise<Response> {
    try {
      // Este log te dirá la verdad: si sale false, el import de arriba está mal.
      console.log("¿Modelos listos?:", { 
        Usuario: typeof Usuario !== 'undefined', 
        Autenticacion: typeof Autenticacion !== 'undefined' 
      });

      const usuarios = await Usuario.findAll({
        where: { activo: true },
        include: [{
          model: Autenticacion,
          as: 'autenticacion',
          attributes: ["email"],
        }],
      });

      return res.status(200).json({
        success: true,
        message: "Usuarios activos obtenidos",
        data: usuarios,
      });
    } catch (error) {
      // Esto nos dirá exactamente qué propiedad falló
      console.error("Detalle del error:", (error as Error).stack);
      return res.status(500).json({ success: false, message: "Error interno" });
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
      const { id } = req.params;
      const { nombre } = req.body; // Validación de seguridad por nombre

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      // Validamos que el nombre coincida (opcional, por seguridad)
      if (usuario.nombre.toLowerCase() !== nombre?.toLowerCase()) {
        return res.status(400).json({ success: false, message: "El nombre no coincide con el ID" });
      }

      // Cambiamos el estado a false (0 en la DB)
      await usuario.update({ activo: false });

      return res.status(200).json({
        success: true,
        message: `Usuario ${usuario.nombre} desactivado correctamente`
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al intentar borrar" });
    }
  }
}

export default new UsuarioController();