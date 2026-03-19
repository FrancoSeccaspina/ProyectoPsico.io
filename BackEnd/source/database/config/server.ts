import app from '../../app.js'; // Importante el .js si usas type: module

const PORT = 3033;

app.listen(PORT, () => {
    console.log(`🚀 Back corriendo en http://localhost:${PORT}`);
});