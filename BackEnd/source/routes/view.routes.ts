import { verificarTokenPorRol } from '../middlewares/verificarToken.js';
//import { Roles } from '../constants/roles';
import express from 'express';
import middleware from '../middlewares/isAuthenticated.js';

const route = express.Router();

route.get("/", function (req, res) {
    res.render("home");
});

route.get("/error", function (req, res) {
    res.render('error', {
        code: 404,
        message: 'Página no encontrada',
        description: 'La página solicitada no existe.'
    });
});

export default route;