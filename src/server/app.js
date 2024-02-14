const express = require("express");
const cors = require("cors");

// DATABASE_STUFF
const connexion = require("../config/database");
const router = require("../routes");
const { errorMiddleware } = require("../middleware/errorMiddleware");

const app = express();
// MIDDLEWARE
app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

connexion();

app.use("/api", router);
app.use(errorMiddleware);
module.exports = app;
