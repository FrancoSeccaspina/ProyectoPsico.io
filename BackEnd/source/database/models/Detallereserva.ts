import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

interface DetalleReservaAttributes {
  id: number;
  reserva_id: number;
  servicio: string;
  descripcion?: string;
  precio?: number;
  duracion?: number;
}

class DetalleReserva
  extends Model<
    InferAttributes<DetalleReserva>,
    InferCreationAttributes<DetalleReserva>
  >
  implements DetalleReservaAttributes
{
  declare id: CreationOptional<number>;
  declare reserva_id: number;
  declare servicio: string;
  declare descripcion: CreationOptional<string>;
  declare precio: CreationOptional<number>;
  declare duracion: CreationOptional<number>;

  static associate(models: any) {
    DetalleReserva.belongsTo(models.Reserva, {
      foreignKey: "reserva_id",
      
    });
  }
}

const initDetalleReservaModel = (sequelize: Sequelize) => {
  DetalleReserva.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      reserva_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "reservas",
          key: "id_reserva",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      servicio: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      duracion: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DetalleReserva",
      tableName: "detalle_reserva",
      freezeTableName: true,
      timestamps: false,
    }
  );
};

export { DetalleReserva, initDetalleReservaModel };