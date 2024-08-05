const { DataTypes } = require("sequelize");

// Export user model function
module.exports = (sequelize) => {
  const User = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );

  // Define associations
  User.associate = (models) => {
    User.hasMany(models.Todos, {
      foreignKey: "userId",
      as: "todos",
    });
  };

  return User;
};
