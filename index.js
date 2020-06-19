const express = require("express");
const config = require("config");
const debug = require("debug")("game21");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");

/**Game Route Configuration */
const GAME_ROUTES = require("./routes");
const { handleError } = require("./Utils/error");

/**
 * App Configuration 
 */
const app = express();

/**
 * Port Configuration
 */
const PORT = process.env.PORT || config.get("PORT");

/**
 * Mongoose Configuration and connection
 */
const MONGO_HOST = config.get("DB.MONGO_HOST");
const MONGO_PORT = config.get("DB.MONGO_PORT");
const MONGO_DB_NAME = config.get("DB.MONGO_DB_NAME");

mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(function () {
    debug(chalk.green('[X]   DATABASE IS CONNECTED'))
  })
  .catch(function (error) {
    debug(chalk.red('[X]  DATABASE CONNECTION FAILURE' + " " + error))
  })

/**
 * Configure Environment
 */

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = "development"
}


/**
 * Configure cors 
 */
app.use(cors());

/**
 * Configure BodyParser
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Configure Morgan
 */
const accessLogStrem = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
})
app.use(morgan('combined', { stream: accessLogStrem }));

/**
 * Initial GET Request 
 */

app.get('/', function (req, res) {
  res.send('GAME21 IS UP');
});

/**Initialize Game Routes */

app.use('/game', GAME_ROUTES)

/**
 * Configure Error Response
 */
app.use((err, req, res, next) => {
  if (err) {
    handleError(err.error_response, res);
  } else {
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
});

/**
 * Serving static files from "public" folder 
 * */
app.use("/api-doc", express.static(path.join(__dirname, 'public')));

/**
 * Configure server
 */
app.listen(PORT, () => {
  debug(chalk.green('[X]   SERVER RUNNING ON PORT ' + " " + PORT))
})
