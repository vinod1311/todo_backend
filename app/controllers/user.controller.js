const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;

// Create and Save a new User
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email or username is already taken
    const existingUser = await User.findByPk({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User with hashed password
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Retrieve all Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

// Retrieve a single User by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// Update a User by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.username = username !== undefined ? username : user.username;
    user.email = email !== undefined ? email : user.email;
    user.password = password !== undefined ? password : user.password;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete a User by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
