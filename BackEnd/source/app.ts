import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(__filename);

// 1. Configurar EJS
app.set('view engine', 'ejs');

// 2. LA RUTA CORRECTA: 
// Como app.ts y la carpeta views están en el mismo nivel (dentro de source)
app.set('views', path.join(__dirname, 'views'));

// 3. Ruta para el Home
app.get('/', (req, res) => {
    res.render('home'); // Esto buscará en source/views/home.ejs
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Buscando vistas en: ${path.join(__dirname, 'views')}`);
});