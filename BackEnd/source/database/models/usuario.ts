import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";

import { Reserva } from "./reserva.js"; 
import { Autenticacion } from "./autenticacion.js";

export class Usuario extends Model<
  InferAttributes<Usuario>,
  InferCreationAttributes<Usuario>
> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare apellido: string;
  declare email: string;
  declare celular: CreationOptional<string | null>;
  declare dni: CreationOptional<string | null>;
  declare aclaracion: CreationOptional<string | null>;
  declare activo: CreationOptional<boolean>;

  declare Reservas?: NonAttribute<Reserva[]>;
  declare Autenticacion?: NonAttribute<Autenticacion>;

  static associate(models: any) {
    this.hasMany(models.Reserva, {
      foreignKey: "id_usuario",
      as: "reservas",
    });

    this.hasOne(models.Autenticacion, {
      foreignKey: "id_usuario",
      as: "autenticacion", // Este alias debe ser igual al del include en el controller
    });
  }
}

export const initUsuarioModel = (sequelize: Sequelize) => {
  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: { 
        type: DataTypes.STRING(50), allowNull: false 
      },
      apellido: { 
        type: DataTypes.STRING(50), allowNull: false 
      },
      email: { 
        type: DataTypes.STRING(100), allowNull: false, unique: true
      },
      celular: { 
        type: DataTypes.STRING(20), allowNull: true 
      },
      dni: { 
        type: DataTypes.STRING(20), allowNull: true 
      },
      aclaracion: { 
        type: DataTypes.TEXT, allowNull: true 
      },
      activo: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: true 
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      timestamps: false,
    }
  );
};