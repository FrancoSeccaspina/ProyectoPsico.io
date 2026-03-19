import { sequelize } from '../config/db.js'; 
import { Usuario, initUsuarioModel } from './usuario.js';
import { Autenticacion, initAutenticacionModel } from './autenticacion.js';
import { Reserva, initReservaModel } from './reserva.js';
// Importa DetalleReserva si ya tienes el archivo:
// import { DetalleReserva, initDetalleReservaModel } from './detallereserva.js';

// 1. OBJETO DE MODELOS (Para exportar y asociar)
export const models = { 
    Usuario, 
    Autenticacion, 
    Reserva,
    // DetalleReserva 
};

const inicializarDB = async () => {
  try {
    // 2. INICIALIZACIÓN (Primero todos los .init)
    initUsuarioModel(sequelize);
    initAutenticacionModel(sequelize);
    initReservaModel(sequelize);
    // initDetalleReservaModel(sequelize); 

    // 3. SINCRONIZACIÓN (Opcional: crea columnas faltantes como 'activo')
    // Desactiva 'alter: true' una vez que la base de datos esté ok
    await sequelize.sync({ alter: true }); 
    console.log('🚀 Modelos sincronizados con la DB');

    // 4. ASOCIACIONES
    Object.values(models).forEach((model: any) => {
      if (model.associate) {
        model.associate(models);
      }
    });

    console.log('🔗 Asociaciones establecidas correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
};

// Ejecutamos la inicialización
inicializarDB();

export { sequelize, Usuario, Autenticacion, Reserva };