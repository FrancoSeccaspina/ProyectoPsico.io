import nodemailer from 'nodemailer';
import { MAIL_USER, MAIL_PASS, MAIL_ADMIN } from '../../../BackEnd/source/configEnv.js'
export interface TurnoMailData {
  nombre: string;
  email: string;
  telefono?: string | null;
  fecha: string;
  hora: string;
  tipo_sesion: 'primera_sesion' | 'individual' | 'grupal';
}

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
      user: "nataliaferri832@gmail.com",
      pass: "shle hyil rdss uite",
  },
});

export async function enviarConfirmacionCliente(data: TurnoMailData): Promise<void> {
  await transporter.sendMail({
    from: `"Sistema de Turnos" <${MAIL_USER}>`,
    to: data.email,
    subject: '✅ Tu turno fue confirmado',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;color:#1a1a1a">
        <h2 style="color:#4f46e5">¡Turno confirmado!</h2>
        <p>Hola <strong>${data.nombre}</strong>, tu turno quedó reservado correctamente.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600;width:40%">Fecha</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5">${data.fecha}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600">Horario</td>
            <td style="padding:10px 12px">${data.hora} hs</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600">Seccion Seleccionada</td>
            <td style="padding:10px 12px">${data.tipo_sesion} hs</td>
          </tr>
        </table>
        <p style="margin-top:24px;color:#555;font-size:14px">
          Si necesitás cancelar o cambiar el turno, respondé este mail.
        </p>
      </div>
    `,
  });
}

export async function enviarAvisoAdmin(data: TurnoMailData): Promise<void> {
  await transporter.sendMail({
    from: `"Sistema de Turnos" <${MAIL_USER}>`,
    to: MAIL_ADMIN,
    subject: `📅 Nueva reserva — ${data.fecha} a las ${data.hora} hs`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;color:#1a1a1a">
        <h2 style="color:#4f46e5">Nueva reserva recibida</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600;width:40%">Nombre</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5">${data.nombre}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600">Email</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5">${data.email}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600">Teléfono</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5">${data.telefono || '—'}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600">Fecha</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5">${data.fecha}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600">Horario</td>
            <td style="padding:10px 12px">${data.hora} hs</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;background:#f4f4f8;font-weight:600">Seccion Seleccionada</td>
            <td style="padding:10px 12px">${data.tipo_sesion} hs</td>
          </tr>
        </table>
      </div>
    `,
  });
}