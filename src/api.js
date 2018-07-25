'use strict';

const log = require('log')(module);


class API {
  async init(context) {
    this.context = context;

    const httpMethod = context.req.method.toLowerCase();
    let method = 'all';

    if (this[httpMethod]) {
      method = httpMethod;
    }

    const controller = this[method];

    try {
      await controller.call(this, context);
    } catch (error) {
      log.error('API_init_1', error);
      this.context.end({ error: `Unhandled exception: ${error.toString()}` });
    }
  }

  // Redefine this method
  all() {
    const defaultResponse = {
      error: true,
      message: `API "${this.context.location}" (${this.context.req.method}) is not implemented`,
    };

    this.context.end(defaultResponse);
  }
}

module.exports = () => new API();
