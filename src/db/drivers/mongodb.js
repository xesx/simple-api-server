'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

const log = require('log')(module);
const { database, host, port } = require('config/mongodb');
const { DEV } = require('env');

const CONNECTION_URI = `mongodb://${host}:${port}/${database}`;
const CONNECTION_OPTIONS = {
  useMongoClient: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 5, // Maintain up to 10 socket connections
};


mongoose.Promise = Promise;
mongoose.set('debug', DEV);

module.exports = mongoose.connect(CONNECTION_URI, CONNECTION_OPTIONS)
  .catch((err) => {
    log.error('mongoose_connect_0 Error MongoDB connection', err.toString());
    throw err;
  })
  .then((connect) => {
    log.ok('MongoDB Connection');
    return connect;
  });
