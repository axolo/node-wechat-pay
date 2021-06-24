'use strict';

const WechatPay = require('../src');
const wechatPay = new WechatPay({ test: true });

wechatPay.http.get('/v3/certificates').then(res => {
  wechatPay.logger.info(res);
}).catch(err => {
  wechatPay.logger.error(err);
});
