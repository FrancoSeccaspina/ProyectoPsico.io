import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('psicomente_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Opcional: para que no ensucie la consola con cada consulta SQL
  define: {
    timestamps: false // Como tus modelos no usan createdAt/updatedAt, esto ayuda
  }
});

// Función opcional para probar la conexión al arrancar
export const conexionDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida con éxito.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};