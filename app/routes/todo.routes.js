const { authJwt } = require("../middlewares");
const controller = require("../controllers/todo.controller");
const upload = require("../middlewares/upload");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/todos",
    [authJwt.verifyToken],
    upload.single("file"),
    controller.createTodo
  );

  // Get a single todo list by user ID
  app.get("/api/todos/:id", [authJwt.verifyToken], controller.getTodoById);

  // Get all todos
  app.get("/api/todos", [authJwt.verifyToken], controller.getTodos);

  // Update a todo by ID
  app.put(
    "/api/todos/:id",
    [authJwt.verifyToken],
    upload.single("file"),
    controller.updateTodo
  );

  // Update a completed status by ID
  app.put(
    "/api/todos/:id/completed",
    [authJwt.verifyToken],
    controller.updateTodoCompletedStatus
  );
  // Delete a todo by ID
  app.delete("/api/todos/:id", [authJwt.verifyToken], controller.deleteTodo);
};
