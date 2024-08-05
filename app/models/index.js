const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const UserModel = require("./user.model");
const TodoModel = require("./todo.model");

const user = UserModel(sequelize, DataTypes);
const todo = TodoModel(sequelize, DataTypes);

// // Initialize associations
// user.associate = (models) => {
//   user.hasMany(models.todo, {
//     foreignKey: "userId",
//     as: "todos",
//   });
// };

// todo.associate = (models) => {
//   todo.belongsTo(models.user, {
//     foreignKey: "userId",
//     as: "user",
//   });
// };

// Call the associate functions
user.associate({ todo });
todo.associate({ user });

const db = {
  sequelize,
  user,
  todo,
};

module.exports = db;
