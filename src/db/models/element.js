'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
      required: '"name" is required',
      maxlength: 64,
    },
    x: {
      type: Number,
      required: '"x" is required',
      validate: {
        validator: Number.isInteger,
      },
    },
    y: {
      type: Number,
      required: '"y" is required',
      validate: {
        validator: Number.isInteger,
      },
    },
    picture: String,
  });

const model = mongoose.model('element', schema);

module.exports = {
  schema,
  model,
};
