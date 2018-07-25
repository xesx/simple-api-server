'use strict';

const { NODE_ENV } = process.env;
let ENV;

if (NODE_ENV) {
  ENV = NODE_ENV.toLowerCase().substr(0, 3);
} else {
  ENV = 'dev';
}

const PROD = (ENV === 'pro');
const DEV = (ENV === 'dev');
const TEST = (ENV === 'tes');

module.exports = { PROD, DEV, TEST, ENV };
