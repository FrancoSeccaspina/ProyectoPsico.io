import { sequelize } from '../config/db.js'; 
import { Usuario, initUsuarioModel } from './usuario.js';
import { Autenticacion, initAutenticacionModel } from './autenticacion.js';
import { Reserva, initReservaModel } from './reserva.js';
import { DetalleReserva, initDetalleReservaModel } from './Detallereserva.js'; // ✅ IMPORTAR

// 1. OBJETO DE MODELOS
export const models = { 
    Usuario, 
    Autenticacion, 
    Reserva,
    DetalleReserva // ✅ AGREGAR
};

const inicializarDB = async () => {
  try {
    // 2. INICIALIZACIÓN
    initUsuarioModel(sequelize);
    initAutenticacionModel(sequelize);
    initReservaModel(sequelize);
    initDetalleReservaModel(sequelize); // ✅ INICIALIZAR

    // ❌ SACAR alter: true (MUY IMPORTANTE)
    await sequelize.sync(); 

    console.log('🚀 Modelos sincronizados con la DB');

    // 3. ASOCIACIONES
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

inicializarDB();

export { sequelize, Usuario, Autenticacion, Reserva, DetalleReserva };