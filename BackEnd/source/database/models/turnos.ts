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
}

interface TurnoCreationAttributes extends Omit<TurnoAttributes, 'id' | 'created_at'> {}
export class Turno extends Model<TurnoAttributes, TurnoCreationAttributes>
  implements TurnoAttributes {
  public id!: number;
  public fecha!: string;
  public hora!: string;
  public nombre!: string;
  public email!: string;
  public telefono!: string | null;
  public estado!: 'pendiente' | 'confirmado' | 'cancelado';
  public readonly created_at!: Date;
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