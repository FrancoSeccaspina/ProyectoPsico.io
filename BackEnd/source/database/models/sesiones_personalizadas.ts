import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

interface SesionPersonalizadaAttributes {
  id: number;
  titulo: string;
  texto: string;
  imagen_url?: string | null;
  activo?: boolean;
}

class SesionPersonalizada
  extends Model<
    InferAttributes<SesionPersonalizada>,
    InferCreationAttributes<SesionPersonalizada>
  >
  implements SesionPersonalizadaAttributes
{
  declare id: CreationOptional<number>;
  declare titulo: string;
  declare texto: string;
  declare imagen_url: CreationOptional<string | null>;
  declare activo: CreationOptional<boolean>;

  static associate(models: any) {
    // Si más adelante querés relacionarlo con otra tabla
    // ejemplo:
    // SesionPersonalizada.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
  }
}

const initSesionPersonalizadaModel = (sequelize: Sequelize) => {
  SesionPersonalizada.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imagen_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "SesionPersonalizada",
      tableName: "sesiones_personalizadas",
      freezeTableName: true,
      timestamps: false,
    }
  );
};

export { SesionPersonalizada, initSesionPersonalizadaModel };