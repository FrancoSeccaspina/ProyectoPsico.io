import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { Reserva } from "./reserva";

interface UsuarioAttributes {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  dni?: string;
  aclaracion?: string;
}

class Usuario
  extends Model<InferAttributes<Usuario>, InferCreationAttributes<Usuario>>
  implements UsuarioAttributes
{
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare apellido: string;
  declare email: string;
  declare celular: CreationOptional<string>;
  declare dni: CreationOptional<string>;
  declare aclaracion: CreationOptional<string>;

  declare Reservas?: Reserva[];

  static associate(models: any) {
    Usuario.hasMany(models.Reserva, {
      foreignKey: "id_usuario",
    });
  }
}

const initUsuarioModel = (sequelize: Sequelize) => {
  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      celular: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      dni: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      aclaracion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      freezeTableName: true,
      paranoid: true,
      timestamps: false,
    }
  );
};

export { Usuario, initUsuarioModel };