import { Request, Response } from "express";
import { Reserva } from "../database/models/reserva.js";
import { DetalleReserva } from  "../database/models/Detallereserva.js";

export class ReservaController {

  async detalle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
  
      const reserva = await Reserva.findByPk(id, {
        include: [
          {
            model: DetalleReserva,
            as: "detalles"
          }
        ]
      });
  
      if (!reserva) {
        return res.status(404).render("error", {
          message: "Reserva no encontrada"
        });
      }
  

  

  
      res.render("reservaDetail", {
        reserva,
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