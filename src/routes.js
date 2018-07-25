'use strict';

const glob = require('glob');
const pathModule = require('path');
const { NOT_FOUND, OK } = require('http-status');

const log = require('log')(module);

const routes = [];
const CONTROLLERS_DIR = `${__dirname}/controllers`;


class Context {
  constructor(request, response, next) {
    this.req = request;
    this.res = response;
    this.next = next;
    this.path = request.path.match(/([^/]+)/ig);
    this.params = Object.assign({}, request.query, request.body);
  }

  end(...args) {
    const body = args && args[0];
    const status = (args && args[1]) || OK;

    this.res.status(status).send(body);
  }
}

class Route {
  constructor(location, handler) {
    this.location = location;
    this.handler = handler;
  }
}

function newRoute(location) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const handler = require(`${__dirname}/controllers${location}`);

  const wrapHandler = async (request, response, next) => {
    const context = new Context(request, response, next);

    if (!handler.all) {
      const msg = `Service ${location} not implemented`;
      log.error('newRoute_0', msg);
      context.end({ error: msg }, NOT_FOUND);
      return;
    }

    context.location = location;

    const stringExceptPath = context.path.join('/').replace(location.substr(1), '');
    context.metaParams = stringExceptPath.substr(1).split('/').filter(p => p);

    try {
      await handler.init(context);
    } catch (error) {
      log.error('newRoute_1', error);
    }
  };

  const regExpLocation = new RegExp(`^${location}(/|$)`);

  routes.push(new Route(regExpLocation, wrapHandler));
}

function getControllers(src) {
  let pathes = glob.sync('/**/*.js', { root: src });
  pathes = pathes.map((path) => {
    if (path.substr(-8) === 'index.js') {
      return path;
    }

    return path.replace(/\.js$/, '/index.js');
  });

  const services = pathes.map(dir => `/${pathModule.dirname(pathModule.relative(src, dir))}`);
  services.sort();

  return services;
}

// Add routes
getControllers(CONTROLLERS_DIR).forEach((apiModule) => {
  newRoute(apiModule);
});

module.exports = routes;
