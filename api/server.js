const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const dbConnection = require('../database/dbConfig.js');

const sessionConfig = {
  name: 'cookiemonster',
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    sidfieldnote: 'sid',
    createTable: true,
    clearInterval: 60000
  })
}

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());


server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
