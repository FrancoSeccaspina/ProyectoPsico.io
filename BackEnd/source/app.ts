import express from 'express';
import path from 'path';
import usuariosRoutes from './routes/usuario.routes.js';
const app = express();

app.set('view engine', 'ejs');
// Usamos path.resolve para evitar problemas de rutas en Windows
app.set('views', path.resolve(process.cwd(), 'source', 'views'));

// Agregamos la carpeta public para que tus imágenes vuelvan a cargar
app.use(express.static(path.resolve(process.cwd(), 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    // Recuerda pasar la variable 'nombre' que pedía tu footer
    res.render("home");
});
app.use('/api/usuarios', usuariosRoutes);

export default app;