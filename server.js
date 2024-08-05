const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv").config();

const db = require("./models");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "todo-session",
    keys: [process.env.COOKIE_SECRET],
    httpOnly: true,
  })
);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to todo application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/todo.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("----****** Database Connection error", err);
    process.exit();
  });
