const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { verifySignUp } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/users", [authJwt.verifyToken], controller.createUser);

  // Get a single user by ID
  app.get("/api/user/:id", [authJwt.verifyToken], controller.getUserById);

  // Update a user by ID
  app.put("/api/users/:id", [authJwt.verifyToken], controller.updateUser);
  // Delete a user by ID
  app.delete("/api/users/:id", [authJwt.verifyToken], controller.deleteUser);

  // app.get("/api/users", [authJwt.verifyToken], controller.getAllUsers);
};
