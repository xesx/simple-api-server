'use strict';

require('colors');


class Logger {
  constructor(module) {
    this.fileName = module.filename.replace(__dirname, '');
  }

  wrapper(type, ...colors) {
    let { fileName } = this;
    let formatType = `[${type}]`;
    return (...args) => {
      colors.forEach((color) => {
        fileName = (color && fileName[color]) || fileName;
        formatType = (color && formatType[color]) || formatType;
      });

      const logsArgs = [fileName, formatType].concat([].slice.call(args));
      // eslint-disable-next-line no-console
      console.log(...logsArgs);
    };
  }

  get logger() {
    const logger = {};

    logger.info = this.wrapper('I', 'yellow');
    logger.debug = this.wrapper('D', 'bgBlue', 'white');
    logger.error = this.wrapper('E', 'red');
    logger.ok = this.wrapper('OK', 'green');

    return logger;
  }
}

module.exports = (module) => {
  const l = new Logger(module);
  return l.logger;
};
