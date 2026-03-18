import { Request, Response } from "express";
import { Reserva } from "../database/models/reserva";
import { Usuario } from "../database/models/usuario";

export class ReservaController {

  // sincronizar tabla
  async syncTable(): Promise<void> {
    try {
      await Reserva.sync();
      console.log("Tabla reservas sincronizada");
    } catch (error) {
      console.error("Error sincronizando reservas:", error);
    }
  }

  // obtener todas las reservas
  async getReservas(req: Request, res: Response): Promise<Response> {
    try {
      const reservas = await Reserva.findAll({
        include: {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "email"],
        },
        order: [["fecha_reserva", "ASC"], ["hora_reserva", "ASC"]],
      });

      return res.status(200).json({
        message: "Reservas obtenidas correctamente",
        data: reservas,
      });

    } catch (error) {
      console.error("Error en getReservas:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // obtener reserva por id
  async getReservaById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const reserva = await Reserva.findByPk(id);

      if (!reserva) {
        return res.status(404).json({
          message: "Reserva no encontrada",
        });
      }

      return res.status(200).json({
        message: "Reserva encontrada",
        data: reserva,
      });

    } catch (error) {
      console.error("Error en getReservaById:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // obtener reservas por usuario
  async getReservasByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const usuarioId = Number(req.params.usuario_id);

      const reservas = await Reserva.findAll({
        where: { usuario_id: usuarioId },
        order: [["fecha_reserva", "ASC"]],
      });

      return res.status(200).json({
        message: "Reservas del usuario obtenidas",
        data: reservas,
      });

    } catch (error) {
      console.error("Error en getReservasByUsuario:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // crear reserva
  async createReserva(req: Request, res: Response): Promise<Response> {
    try {
      const { usuario_id, fecha_reserva, hora_reserva, observaciones } = req.body;

      // validar si el horario ya está ocupado
      const reservaExistente = await Reserva.findOne({
        where: {
          fecha_reserva,
          hora_reserva,
        },
      });

      if (reservaExistente) {
        return res.status(400).json({
          message: "Ese horario ya está reservado",
        });
      }

      const nuevaReserva = await Reserva.create({
        usuario_id,
        fecha_reserva,
        hora_reserva,
        observaciones,
        estado: "PENDIENTE",
      });

      return res.status(201).json({
        message: "Reserva creada correctamente",
        data: nuevaReserva,
      });

    } catch (error) {
      console.error("Error en createReserva:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // actualizar reserva
  async updateReserva(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      const reserva = await Reserva.findByPk(id);

      if (!reserva) {
        return res.status(404).json({
          message: "Reserva no encontrada",
        });
      }

      await reserva.update(req.body);

      return res.status(200).json({
        message: "Reserva actualizada correctamente",
        data: reserva,
      });

    } catch (error) {
      console.error("Error en updateReserva:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  // eliminar reserva
  async deleteReserva(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      const reserva = await Reserva.findByPk(id);

      if (!reserva) {
        return res.status(404).json({
          message: "Reserva no encontrada",
        });
      }

      await reserva.destroy();

      return res.status(200).json({
        message: "Reserva eliminada correctamente",
      });

    } catch (error) {
      console.error("Error en deleteReserva:", (error as Error).message);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

}

export default new ReservaController();
