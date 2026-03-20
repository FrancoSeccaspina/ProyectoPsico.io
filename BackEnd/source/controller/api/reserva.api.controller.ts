import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Reserva } from "../../database/models/reserva.js";
import { DetalleReserva } from "../../database/models/Detallereserva.js";
import { Usuario } from "../../database/models/usuario.js";
import { EstadosReserva } from "../../constants/estadoReserva.js";

export class ReservaApiController {

    async getReservas(req: Request, res: Response): Promise<Response> {
        try {
            const reservas = await Reserva.findAll();
            return res.status(200).json({
                success: true,
                message: "Reservas obtenidas",
                data: reservas,
            });
        } catch (error) {
            console.error("Error en getReservas:", (error as Error).message);
            return res.status(500).json({ success: false, message: "Error interno del servidor" });
        }


    }
    async getReservaById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const reserva = await Reserva.findByPk(id);
            return res.status(200).json({
                success: true,
                message: "Reserva obtenida",
                data: reserva,
            });
        } catch (error) {
            console.error("Error en getReservaById:", (error as Error).message);
            return res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
}  
async confirmarReserva(req: Request, res: Response) {
    try {
        const idReserva = parseInt(req.params.id, 10);

        if (isNaN(idReserva)) {
            return res.status(400).json({ message: "ID de reserva inválido" });
        }

        const reserva = await Reserva.findByPk(idReserva, {
            include: [
                {
                    model: DetalleReserva // 👈 trae los servicios
                },
                {
                    model: Usuario,
                    attributes: ['id', 'nombre', 'apellido']
                }
            ]
        });

        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }

        // ❌ Eliminamos lógica de stock (no aplica a servicios)

        // ✅ Actualizamos estado
        await reserva.update({ estado: EstadosReserva.CONFIRMADO });

        return res.status(200).json({
            message: "Reserva confirmada correctamente",
            reserva
        });

    } catch (error) {
        console.error("Error al confirmar reserva:", (error as Error).message);
        return res.status(500).json({ message: "Error al confirmar reserva" });
    }
}

} 

export default new ReservaApiController();