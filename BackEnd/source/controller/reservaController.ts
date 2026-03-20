import { Request, Response } from "express";
import { Reserva } from "../database/models/reserva.js";
import { DetalleReserva } from  "../database/models/Detallereserva.js";

export class ReservaController {

  async detalle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // 🔹 Buscar reserva
      const reserva = await Reserva.findByPk(id);

      if (!reserva) {
        res.status(404).render("error", {
          message: "Reserva no encontrada"
        });
        return;
      }

      // 🔹 Buscar detalle
      const detalleReserva = await DetalleReserva.findAll({
        where: { reserva_id: id }
      });

      // 🔹 Calcular total
      const total = detalleReserva.reduce((acc, item) => {
        return acc + Number(item.precio || 0);
      }, 0);

      //reserva.setDataValue("total", total);

      // 🔹 Render
      res.render("reservaDetail", {
        reserva,
        detalleReserva
      });

    } catch (error) {
      console.error("Error en detalle de reserva:", (error as Error).message);

      res.status(500).render("error", {
        message: "Error al cargar la reserva"
      });
    }
  }
}


export default new ReservaController();