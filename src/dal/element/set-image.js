'use strict';

const sizeOf = require('image-size');
const jimp = require('jimp');

const log = require('log')(module);
const consts = require('consts');
const { model } = require('db/models/element');

const fsStore = `${consts.STATIC}/elements`;
const uriStore = '/static/elements';
const MAX_LENGTH = 400;


module.exports = (form) => {
  const { files, fields } = form;
  const elementId = fields && fields['element-id'];
  const imageBuffer = files && files['element-image'];

  if (!elementId || !imageBuffer) {
    log.info('dal_element_setimage_0 Params "element-id" & "element-image" is required');
    return null;
  }

  const { type, height, width } = sizeOf(imageBuffer);

  if (type !== 'png') {
    log.info('dal_element_setimage_1 Only png');
    return null;
  }

  return jimp.read(imageBuffer)
    .then((image) => {
      if (height > width && height > MAX_LENGTH) {
        image.resize(jimp.AUTO, MAX_LENGTH);
      } else if (width > height && width > MAX_LENGTH) {
        image.resize(MAX_LENGTH, jimp.AUTO);
      }

      image.write(`${fsStore}/${elementId}/picture.png`);

      return model.findByIdAndUpdate(elementId, {
        $set: { picture: `${uriStore}/${elementId}/picture.png` },
      })
        .catch((err) => {
          log.info('dal_element_setimage_2 Error while set picture url in db', err.toString());
          throw new Error('dal_element_setimage_2');
        });
    })
    .then(() => true)
    .catch((err) => {
      log.info('dal_element_setimage_10', err.toString());
    });
};
