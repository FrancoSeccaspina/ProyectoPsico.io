import {
  Model,
  DataTypes,
  Sequelize,
} from "sequelize";
import { sequelize } from '../config/db.js';

interface TopicoAttributes {
  id: number;
  titulo: string;
  resenia: string;
  contenido: string;
  imagen_url?: string | null;
  slug: string;
  publicado: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface TopicoCreationAttributes extends Omit<TopicoAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Topico extends Model<TopicoAttributes, TopicoCreationAttributes>
  implements TopicoAttributes {
  declare id: number;
  declare titulo: string;
  declare resenia: string;
  declare contenido: string;
  declare imagen_url: string | null;
  declare slug: string;
  declare publicado: boolean;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export const initTopicoModel = (sequelize: Sequelize) => {
  Topico.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      resenia: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contenido: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      imagen_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      publicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'topicos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};