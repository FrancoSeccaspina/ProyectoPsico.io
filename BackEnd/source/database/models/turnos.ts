import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
  } from "sequelize";
import { sequelize } from '../config/db.js';

interface TurnoAttributes {
  id: number;
  fecha: string;
  hora: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
  created_at?: Date;
  tipo_sesion: 'primera_sesion' | 'individual' | 'grupal';
}

interface TurnoCreationAttributes extends Omit<TurnoAttributes, 'id' | 'created_at'> {}
export class Turno extends Model<TurnoAttributes, TurnoCreationAttributes>
  implements TurnoAttributes {
  declare id: number;
  declare fecha: string;
  declare hora: string;
  declare nombre: string;
  declare email: string;
  declare telefono: string | null;
  declare estado: 'pendiente' | 'confirmado' | 'cancelado';
  declare tipo_sesion: 'primera_sesion' | 'individual' | 'grupal';
  
  declare readonly created_at: Date;
}
export const initTurnoModel = (sequelize: Sequelize) => {
Turno.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: null,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    tipo_sesion: {
      type: DataTypes.ENUM('primera_sesion', 'individual', 'grupal'),
      allowNull: false,
      defaultValue: 'primera_sesion',
    },
  },
  {
    sequelize,
    tableName: 'turnos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
    );
};