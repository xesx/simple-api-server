'use strict';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status');

const api = require('api')();
const dal = require('dal/element');
const log = require('log')(module);

const FIELDS = ['name', 'x', 'y', 'picture'];

api.all = async (ctx) => {
  const {
    metaParams: [id],
  } = ctx;

  if (!id) {
    log.info('api_element_get_0', '"id" is required');
    ctx.end(undefined, BAD_REQUEST);
    return;
  }

  let element;

  try {
    element = await dal.model.findById(id).select(FIELDS).lean();
  } catch (err) {
    log.error(`api_element_set_1 Error while find element ${id}`, err.toString());
    ctx.end(undefined, INTERNAL_SERVER_ERROR);
    return;
  }

  ctx.end(element, OK);
};

module.exports = api;
