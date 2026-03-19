import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { Autenticacion } from '../database/models/autenticacion.js';
import { Usuario } from '../database/models/usuario.js';
import bcrypt from 'bcryptjs';
import { firmarToken, obtenerPayload } from "../utils/generadorToken.js";

export class UsuarioController {

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const usuario = await Usuario.findOne({ where: { id: req.params.id } });

      if (usuario) {
        return res.status(200).json({
          success: true,
          message: "Usuario encontrado",
          usuario,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    } catch (error) {
      console.error("Error en show:", (error as Error).message);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

 async showAll(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await Usuario.findAll({
        include: {
          model: Autenticacion,
          attributes: ["email"],
        },
      });
      if (usuarios.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Usuarios encontrados",
          usuarios,
        });
      }
      return res.status(404).json({
        success: false,
        message: "No se encontraron usuarios",
      });
    } catch (error) {
      console.error("Error en show:", (error as Error).message);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
async softDelete(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    // Buscamos al usuario
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Al no haber columna 'rol' o 'estado', ejecutamos un borrado físico
    await usuario.destroy();

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado de la base de datos correctamente",
    });

  } catch (error) {
    console.error("Error al borrar usuario:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Error interno al procesar la baja",
    });
  }
}

 async update(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const { nombre, apellido, email, celular, dni, aclaracion } = req.body;

      const usuario = await Usuario.findOne({ where: { id } });
      if (!usuario) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      await usuario.update({
        apellido,
        nombre,
        celular,
        email,
        dni,
        aclaracion
      });

      // Actualizar sesión si corresponde
      if (req.session.usuarioLogueado) {
        Object.assign(req.session.usuarioLogueado, {
          apellido,
          nombre,
          celular,
          email,
          aclaracion
        });
      }

      // 🔁 Redireccionar al perfil
      return res.redirect('/perfil');

    } catch (error) {
      console.error("Error al actualizar usuario:", (error as Error).message);
      return res.status(500).json({ success: false, message: "Error al actualizar usuario" });
    }
  }

async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { contrasenia } = req.body;

      const decodedUsuario = obtenerPayload(token);
      const usuario = await Autenticacion.findOne({ where: { id_usuario: decodedUsuario.id } });

      if (!usuario) {
        res.status(404).render("login", {
          mostrarModal: true,
          modalTitle: "Recuperar contraseña",
          modalMessage: "Usuario no encontrado"
        });
        return
      }

      const hashedPassword = bcrypt.hashSync(contrasenia, 8);
      await usuario.update({ password_hash: hashedPassword });

      res.status(200).render("login", {
        mostrarModal: true,
        modalTitle: "Recuperar contraseña",
        modalMessage: "Autenticacion actualizada"
      });
      return

    } catch (error) {
      console.error("Error al cambiar contraseña:", (error as Error).message);
      res.status(500).render("error", {
        title: "Error del servidor",
        code: 500,
        message: "Error al cambiar la contraseña",
        description: "Ocurrió un error inesperado.",
        error: (error as Error).message
      });
      return
    }
  }

  /*async envioEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const autenticacionUsuario = await Autenticacion.findOne({ where: { email } });
      if (!autenticacionUsuario) {
        res.status(404).render("login", {
          mostrarModal: true,
          modalTitle: "Recuperar contraseña",
          modalMessage: "Usuario no encontrado"
        });
        return
      }

      const token = firmarToken({
        id: autenticacionUsuario.id_usuario,
        nombre: "",
        rol: "",
      }, "5m")

      // Url que le va a llegar al usuario
      const resetUrl = `http://${REACT_APP_BACKEND_DOMAIN_HOST}/users/change-password/${token}`;

      const info = await transporter.sendMail({
        from: '"Olvide Mi Contraseña" <activafitness0@gmail.com>',
        to: email,
        subject: "Olvide Mi Contraseña",
        html: //aca se envia un <a> con el link de reset
          `<p>Hola,</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetUrl}">Restablecer Contraseña</a>
          <p>Si no solicitaste este cambio, podes ignorar este mensaje.</p>
          <p>Saludos,</p>`
      });

      res.status(200).render("login", {
        mostrarModal: true,
        modalTitle: "Correo de verificación enviado",
        modalMessage: "Se envió un correo de verificación a la dirección ingresada. Revisá tu bandeja de entrada y seguí las instrucciones para continuar."

      });

    } catch (error) {
      console.error("Error en solicitudChangePassword:", (error as Error).message);
      res.status(500).render("error", {
        title: "Error del servidor",
        code: 500,
        message: "Error al procesar la solicitud de cambio de contraseña",
        description: "Ocurrió un error inesperado.",
        error: (error as Error).message
      });
      return
    }
  }    HAY QUE VER SI ES ASI  */

  async renderChangePassword(req: Request, res: Response) {
    const { token } = req.params;
    res.render('changePassword', {
      token,
      errors: {},
      oldData: {}
    });
  }
}

export default new UsuarioController(); 