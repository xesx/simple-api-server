'use strict';

const formidable = require('formidable');
const Promise = require('bluebird');


module.exports = function formParser(req) {
  const form = new formidable.IncomingForm();
  const result = { fields: {}, files: {} };

  form.parse(req);

  form.onPart = (part) => {
    if (!part.filename) {
      form.handlePart(part);
      return;
    }

    let buffer;

    part.addListener('data', (data) => {
      if (!buffer) {
        buffer = data;
        return;
      }

      buffer = Buffer.concat([buffer, data]);
    });
    part.addListener('end', () => { form.emit('file', part.name, buffer); });
  };

  return new Promise(resolve => form
    .on('file', (name, buffer) => { result.files[name] = buffer; })
    .on('field', (name, value) => { result.fields[name] = value; })
    .on('end', () => resolve(result)));
};
