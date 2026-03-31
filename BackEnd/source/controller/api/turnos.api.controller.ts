import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { enviarConfirmacionCliente, enviarAvisoAdmin, TurnoMailData } from '../../utils/mailer.js';
import { Turno } from '../../database/models/turnos.js';

const HORAS_DISPONIBLES = ['09:00:00','10:00:00','11:00:00','12:00:00','14:00:00','15:00:00','16:00:00','17:00:00','18:00:00'];
export class TurnoApiController { 

    async getTurnosPorMes(req: Request, res: Response): Promise<Response> {
  try {
    const { mes } = req.query; // formato: "2026-04"
    if (!mes || typeof mes !== 'string') {
      res.status(400).json({ error: 'Parámetro "mes" requerido (formato: YYYY-MM)' });
      return;
    }

    const [anio, month] = mes.split('-');
    const desde = `${anio}-${month}-01`;
    const hasta = `${anio}-${month}-31`;

    const turnos = await Turno.findAll({
      where: {
        fecha: { [Op.between]: [desde, hasta] },
        estado: { [Op.ne]: 'cancelado' },
      },
      attributes: ['fecha', 'hora'],
    });

    res.json({ ocupados: turnos.map(t => ({ fecha: t.fecha, hora: t.hora })) });
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

    async reservarTurno (req: Request, res: Response): Promise<Response> {
  try {
    const { fecha, hora, nombre, email, telefono,tipo_sesion } = req.body;

    if (!fecha || !hora || !nombre || !email || !tipo_sesion) {
      res.status(400).json({ error: 'Faltan campos obligatorios: fecha, hora, nombre, email, tipo de sesion' });
      return;
    }

    const horaFormateada = hora.length === 5 ? `${hora}:00` : hora;

    if (!HORAS_DISPONIBLES.includes(horaFormateada)) {
      res.status(400).json({ error: 'Horario no válido' });
      return;
    }

    const yaOcupado = await Turno.findOne({
      where: { fecha, hora: horaFormateada, estado: { [Op.ne]: 'cancelado' } },
    });

    if (yaOcupado) {
      res.status(409).json({ error: 'Ese turno ya está reservado' });
      return;
    }

    const nuevoTurno = await Turno.create({
      fecha,
      hora: horaFormateada,
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono?.trim() || null,
      estado: 'pendiente',
      tipo_sesion, // ← aquí podrías mapear según lo que envíe el frontend
    });

    // 📧 Envío de mails — no bloquea ni cancela la reserva si falla
    const mailData: TurnoMailData = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono?.trim() || null,
      fecha,
      hora: horaFormateada,
      tipo_sesion, // ← aquí podrías mapear según lo que envíe el frontend
    };

    Promise.all([
      enviarConfirmacionCliente(mailData),
      enviarAvisoAdmin(mailData),
    ]).catch(err => console.error('⚠️  Error al enviar mails (turno guardado igual):', err));

    res.status(201).json({ mensaje: 'Turno reservado con éxito', turno: nuevoTurno });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ error: 'Ese turno ya está reservado' });
      return;
    }
    console.error('Error al reservar turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

    async cancelarTurno (req: Request, res: Response): Promise<Response>{
  try {
    const { id } = req.params;

    const turno = await Turno.findByPk(id);
    if (!turno) {
      res.status(404).json({ error: 'Turno no encontrado' });
      return;
    }

    await turno.update({ estado: 'cancelado' });
    res.json({ mensaje: 'Turno cancelado correctamente' });
  } catch (error) {
    console.error('Error al cancelar turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
async getTodosLosTurnos(req: Request, res: Response): Promise<void> {
  try {
    const turnos = await Turno.findAll({
      order: [['fecha', 'ASC'], ['hora', 'ASC']],
    });
    res.json(turnos);
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async cambiarEstado(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['pendiente', 'confirmado', 'cancelado'].includes(estado)) {
      res.status(400).json({ error: 'Estado inválido' });
      return;
    }

    const turno = await Turno.findByPk(id);
    if (!turno) {
      res.status(404).json({ error: 'Turno no encontrado' });
      return;
    }

    await turno.update({ estado });
    res.json({ mensaje: 'Estado actualizado', turno });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async eliminarTurno(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const turno = await Turno.findByPk(id);
    if (!turno) {
      res.status(404).json({ error: 'Turno no encontrado' });
      return;
    }

    await turno.destroy();
    res.json({ mensaje: 'Turno eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async editarTurno(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { fecha, hora, nombre, email, telefono, tipo_sesion, estado } = req.body;

    const turno = await Turno.findByPk(id);
    if (!turno) {
      res.status(404).json({ error: 'Turno no encontrado' });
      return;
    }

    await turno.update({
      ...(fecha && { fecha }),
      ...(hora && { hora }),
      ...(nombre && { nombre: nombre.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(telefono !== undefined && { telefono: telefono?.trim() || null }),
      ...(tipo_sesion && { tipo_sesion }),
      ...(estado && { estado }),
    });

    res.json({ mensaje: 'Turno actualizado correctamente', turno });
  } catch (error) {
    console.error('Error al editar turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
}
export default new TurnoApiController();