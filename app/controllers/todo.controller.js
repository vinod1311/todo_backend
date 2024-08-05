// Import the Todo and User models
const db = require("../models");
const path = require("path");
const fs = require("fs");
const User = db.user;
const Todo = db.todo;

// Create a new Todo
exports.createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, userId } = req.body;
    let filePath = null;

    // Handle file upload
    if (req.file) {
      filePath = req.file.path; // Get the uploaded file path
    }

    console.log("--------req.file.path", req.file.path);
    console.log("--------filePath", filePath);

    // Validate user existence
    const user = await User.findByPk(userId);
    if (!user) {
      // Delete uploaded file if user is not found
      if (filePath) fs.unlinkSync(filePath);
      return res.status(404).json({ message: "User not found" });
    }

    const validDueDate = dueDate ? new Date(dueDate) : null;
    if (validDueDate && isNaN(validDueDate.getTime())) {
      if (filePath) fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Invalid due date format" });
    }

    // Create the todo
    const newTodo = await Todo.create({
      title,
      description,
      dueDate: validDueDate,
      file: filePath,
      userId,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Error creating Todo", error });
  }
};

// Get all Todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });
    res.status(200).json(todos);
  } catch (error) {
    console.log("Error Creating Todo", error);
    res.status(500).json({ message: "Error retrieving Todos", error });
  }
};

// Get a Todo by ID
exports.getTodoById = async (req, res) => {
  console.log("------getTodoById----");

  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.log("Error retrieving Todo BY ID", error);
    res.status(500).json({ message: "Error retrieving Todo", error });
  }
};

// Update a Todo by ID
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed, userId } = req.body;
    let newFilePath = null;

    // Handle file upload
    if (req.file) {
      newFilePath = req.file.path; // Get the uploaded file path
    }

    // Validate user existence
    const user = await User.findByPk(userId);
    if (!user) {
      // Delete uploaded file if user is not found
      if (newFilePath) fs.unlinkSync(newFilePath);
      return res.status(404).json({ message: "User not found" });
    }

    const todo = await Todo.findByPk(id);

    if (!todo) {
      // Delete uploaded file if Todo is not found
      if (newFilePath) fs.unlinkSync(newFilePath);
      return res.status(404).json({ message: "Todo not found" });
    }

    // Delete old file if a new file is uploaded
    if (newFilePath && todo.filePath) {
      fs.unlinkSync(todo.filePath);
    }

    // Update fields
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.dueDate = dueDate || todo.dueDate;
    todo.filePath = newFilePath || todo.filePath;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.userId = userId || todo.userId;

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    console.log("Error Updating Todo", error);
    if (req.file) fs.unlinkSync(req.file.path); // Delete uploaded file on error
    res.status(500).json({ message: "Error updating Todo", error });
  }
};

// Delete a Todo by ID
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Delete associated file if exists
    if (todo.filePath) {
      fs.unlinkSync(todo.filePath);
    }

    await todo.destroy();
    res.status(204).send(); // No content response
  } catch (error) {
    console.log("Error Deleting Todo", error);
    res.status(500).json({ message: "Error deleting Todo", error });
  }
};

// Update the completed status of a Todo by ID
exports.updateTodoCompletedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // Find the Todo item by ID
    const todo = await Todo.findByPk(id);

    // Check if the Todo item exists
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = completed;

    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    console.log("Error Update Todo Completed Status Todo", error);
    res.status(500).json({ message: "Error updating Todo", error });
  }
};
