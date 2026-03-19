//import { conexionDB, sequelize } from '../connection/connection'
import { initUsuarioModel, Usuario } from './usuario.js';
import { Autenticacion, initAutenticacionModel } from './autenticacion.js';
import { Sequelize } from 'sequelize';

const inicializarDB = async (models: Record<string, any>) => {
  try {
    await conexionDB();

    // TODO : resolver con un metodo statico en cada modelo
    initUsuarioModel(sequelize);
    initAutenticacionModel(sequelize);
    console.log('Modelos inicializados')
    //Producto.associate({ DetalleReserva });
    //DetalleReserva.associate({ Producto, Reserva });
    Object.values(models).forEach(model => {
      if (model.associate) {
        model.associate(models);
      }
    });

    console.log('Asociaciones de modelos establecidas');
  } catch (error) {
    console.error('Error al inicializar Modelos:', error);
  }
}

export const models = {
  Usuario,
  Autenticacion,
};

inicializarDB(models)

export {
  Sequelize
};