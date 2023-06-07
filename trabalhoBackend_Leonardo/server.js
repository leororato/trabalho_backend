const express = require("express");
const logger = require("./middleware/logger");
const server = express();

const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const recipesRouter = require('./routes/recipe');

server.use(express.json());
server.use(logger);
server.use(usersRouter);
server.use(authRouter);
server.use(recipesRouter);

server.get("*", (req,res) => {
  res.status(404).send("{Erro}");
});

module.exports = server;
