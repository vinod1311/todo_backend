const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  console.log("----Sign Up called in auth controller-----");

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    console.log("---------");
    console.log(existingUser);
    console.log("---------");

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "Username or email is already taken!" });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Save User to Database
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(201).send({ message: "User was registered successfully!" });
  } catch (err) {
    console.log(`Sign Up Error`, err);
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    console.log(`Sign In Error`, err);
    res.status(500).send({ message: err.message });
  }
};
