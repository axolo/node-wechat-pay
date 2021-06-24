'use strict';

class WechatPayError extends Error {
  constructor(message, info) {
    super(message);
    this.name = this.constructor.name;
    this.info = info;
  }
}

module.exports = WechatPayError;
