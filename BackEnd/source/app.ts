import express from 'express';
import path from 'path';
import usuariosRoutes from './routes/usuario.routes.js';
// IMPORTANTE: Esto ejecuta la inicialización y las asociaciones de tus modelos
import './database/models/index.js'; 

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'source', 'views'));

app.use(express.static(path.resolve(process.cwd(), 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.render("home");
});

app.use('/api/usuarios', usuariosRoutes);

export default app;