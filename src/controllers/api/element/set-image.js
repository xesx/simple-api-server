'use strict';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status');

const api = require('api')();
const log = require('log')(module);
const dal = require('dal/element');
const formParser = require('lib/form-parser');


api.all = async (ctx) => {
  const { req } = ctx;
  let form;
  let result;

  try {
    form = await formParser(req);
  } catch (err) {
    log.error('api_element_setimage_0 Error while parse form', err.toString());
    ctx.end(undefined, INTERNAL_SERVER_ERROR);
    return;
  }

  if (!form) {
    log.info('api_element_setimage_1 Can\'t parse form');
    ctx.end(undefined, BAD_REQUEST);
    return;
  }

  try {
    result = await dal.setImage(form);
  } catch (err) {
    log.error('api_element_setimage_3 Error while upload image', err.toString());
    ctx.end(undefined, INTERNAL_SERVER_ERROR);
    return;
  }

  if (!result) {
    log.error('api_element_setimage_4 Empty result');
    ctx.end(undefined, BAD_REQUEST);
    return;
  }

  ctx.end({ status: 'OK' }, OK);
};

module.exports = api;
