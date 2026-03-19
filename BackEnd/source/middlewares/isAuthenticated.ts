import { NextFunction, Request, Response } from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    user?: any; // opcional
    usuarioLogueado?: {
      id: number;
      email: string;
      nombre?: string;
      apellido?: string;
      celular?: string;
      dni?: string;
      aclaracion?:string
    };
  }
}

function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.session.usuarioLogueado) {
    return next();
  } else {
    res.redirect('/login');
  }
}

function setUsuarioLogueado(req: Request, res: Response, next: NextFunction): void {
  res.locals.usuarioLogueado = req.session.usuarioLogueado || null;
  console.log('Usuario logueado:', res.locals.usuarioLogueado);
  next();
}

export default { isAuthenticated, setUsuarioLogueado };

