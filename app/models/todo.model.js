const { DataTypes } = require("sequelize");

// Export Todo model function
module.exports = (sequelize) => {
  const Todo = sequelize.define(
    "Todos",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
      file: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   isUrl: true,
        // },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );

  Todo.associate = (models) => {
    Todo.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Todo;
};
