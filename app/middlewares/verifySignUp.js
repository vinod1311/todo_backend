const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findByPk({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findByPk({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
    });

    // Phone
    User.findByPk({
      phone: req.body.phone,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Phone is already in use!" });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
