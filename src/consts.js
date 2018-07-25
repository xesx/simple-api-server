'use strict';

const PROJECT_ROOT = module.filename.split('/').slice(0, -2).join('/');


module.exports = {
  PROJECT_ROOT,
  STATIC: `${PROJECT_ROOT}/static`,
};
