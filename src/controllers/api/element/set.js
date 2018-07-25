'use strict';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status');

const api = require('api')();
const dal = require('dal/element');
const log = require('log')(module);


api.all = async (ctx) => {
  const {
    metaParams,
    params,
  } = ctx;

  const id = metaParams && metaParams[0];
  let element;

  try {
    if (id) {
      element = await dal.model.findByIdAndUpdate(id, { $set: params }, { runValidators: true });
    } else {
      element = await dal.model.create(params);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      log.info('api_element_set_0', err.toString());
      ctx.end(undefined, BAD_REQUEST);
      return;
    }

    log.error('api_element_set_1 Error while create or update element', err.toString());
    ctx.end(undefined, INTERNAL_SERVER_ERROR);
    return;
  }

  ctx.end({ id: element._id }, OK);
};

module.exports = api;
