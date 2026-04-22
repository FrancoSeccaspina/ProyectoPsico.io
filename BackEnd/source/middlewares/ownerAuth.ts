import { Request, Response, NextFunction } from 'express';
import { OWNER_TOKEN } from '../constants/configEnv.js';

/**
 * Middleware que protege rutas exclusivas del dueño
 * mediante un token secreto pasado como query param.
 * 
 * Uso: GET /dashboard?token=clave_secreta
 */
export const ownerAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.query.token as string;

  if (!token) {
    console.warn(`Acceso denegado: Token no proporcionado. Ruta: ${req.originalUrl}`);
    res.status(401).redirect('/');
    return;
  }

  if (token !== OWNER_TOKEN) {
    console.warn(`Acceso denegado: Token inválido. Ruta: ${req.originalUrl}`);
    res.status(403).redirect('/');
    return;
  }

  next();
};