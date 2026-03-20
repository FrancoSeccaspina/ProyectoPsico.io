import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

interface ReservaAttributes {
  id: number;
  usuario_id: number;
  fecha_reserva: Date;
  hora_reserva: string;
  estado: string;
  observaciones?: string;
  created_at: Date;
}

export class Reserva extends Model<InferAttributes<Reserva>, InferCreationAttributes<Reserva>> implements ReservaAttributes {
  declare id: CreationOptional<number>;
  declare usuario_id: number;
  declare fecha_reserva: Date;
  declare hora_reserva: string;
  declare estado: CreationOptional<string>;
  declare observaciones: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;

  static associate(models: any) {
    this.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario"
    });

    // Solo asociar si DetalleReserva existe en el objeto models
    if (models.DetalleReserva) {
        this.hasMany(models.DetalleReserva, {
          foreignKey: "reserva_id",
          as: "detalles"
        });
        
    }
  }
}

export const initReservaModel = (sequelize: Sequelize) => {
  Reserva.init({
      id: { 
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true 
        
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "usuarios", key: "id" }
      },
      fecha_reserva: { 
        type: DataTypes.DATEONLY, allowNull: false 
        
      },
      hora_reserva: { 
        type: DataTypes.TIME, allowNull: false 
        
      },
      estado: { 
        type: DataTypes.STRING(20), allowNull: false, defaultValue: "PENDIENTE" 
        
      },
      observaciones: { 
        type: DataTypes.TEXT, allowNull: true 
        
      },
      created_at: { 
        type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW 
        
      },
    },
    { sequelize, modelName: "Reserva", tableName: "reservas", timestamps: false }
  );
};