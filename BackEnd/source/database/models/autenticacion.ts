import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

interface AutenticacionAttributes{
    id: number,
    id_usuario: number,
    email: string,
    password_hash: string
}

class Autenticacion extends Model<InferAttributes<Autenticacion>, InferCreationAttributes<Autenticacion>> implements AutenticacionAttributes{
    declare id: CreationOptional<number>;
    declare email: string;
    declare password_hash: string;
    declare id_usuario: number;

     static associate(models: any) {
    Autenticacion.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario', 
    });
  }
}

const initAutenticacionModel = (sequelize: Sequelize) => {
  Autenticacion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Autenticacion',
      tableName: 'autenticacion',
      freezeTableName: true,
      paranoid: true,
      timestamps: false,
    }
  );
};

export { Autenticacion, initAutenticacionModel };
