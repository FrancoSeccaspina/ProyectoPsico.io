import express from 'express';
import path from 'path';
//APIS
import usuariosApiRoutes from './routes/api/usuario.api.routes.js';
import reservaApiRoutes from './routes/api/reserva.api.routes.js';
// IMPORTANTE: Esto ejecuta la inicialización y las asociaciones de tus modelos
import reservaRoutes from './routes/reserva.routes.js';
import './database/models/index.js'; 

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'source', 'views'));

app.use(express.static(path.resolve(process.cwd(), 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.render("home");
});
app.get('/sesiones', (req, res) => {
    res.render("sesiones");
});
app.get('/sobre-mi', (req, res) => {
    res.render("sobre-mi");
});
app.get('/primera-consulta', (req, res) => {
    res.render("primera-consulta");
});
app.get('/consulta-individual', (req, res) => {
    res.render("consulta-individual");
});
app.get('/consulta-grupal', (req, res) => {
    res.render("consulta-grupal");
});
app.get('/reserva', (req, res) => {
    res.render("reserva");
});
app.use('/api', 
    reservaApiRoutes,
    usuariosApiRoutes);


app.use(reservaRoutes);

export default app;