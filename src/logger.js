'use strict';

const path = require('path');
const log4js = require('log4js');

/**
 * **日志**
 *
 * @todo 有效且人性化的可配置项
 * @class WechatPayLogger
 */
class WechatPayLogger {
  constructor(config = {}) {
    const {
      level = 'error',
      name = 'WechatPay',
      path: logPath = path.join(__dirname, '../logs'),
    } = config;
    const filename = path.join(logPath, `${level}.log`);
    log4js.configure({
      appenders: {
        stdout: {
          type: 'stdout',
        },
        [name]: {
          type: 'dateFile',
          encoding: 'utf-8',
          pattern: 'yyyyMMdd',
          alwaysIncludePattern: true,
          keepFileExt: true,
          filename,
        },
      },
      categories: {
        default: {
          appenders: [ 'stdout', name ],
          level,
        },
      },
    });
    return log4js.getLogger(name);
  }
}

module.exports = WechatPayLogger;
