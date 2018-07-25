'use strict';

const express = require('express');
const app = require('express')();
const bodyParser = require('body-parser');
const { NOT_FOUND } = require('http-status');
require('colors');

require('db/drivers/mongodb');
const routes = require('routes');
const log = require('log')(module);

app.set('port', 4273);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(express.static('src/views'));
app.use('/static', express.static('static'));

// for debug
app.use((req, res, next) => {
  next();
});

// Routes
routes.forEach(route => app.all(route.location, route.handler));

app.use((req, res) => {
  res.status(NOT_FOUND);
  res.send({ error: 'NOT_FOUND' });
});

// Server create
app.listen(app.get('port'), () => {
  const port = app.get('port').toString().yellow.underline;
  const msg = 'Server started on port '.yellow + port;
  log.info(msg);
});
