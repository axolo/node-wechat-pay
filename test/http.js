'use strict';

const WechatPay = require('../src');
const wechatPay = new WechatPay({ test: true });

wechatPay.http({
  method: 'POST',
  url: '/pay/transactions/jsapi',
}).then(res => {
  wechatPay.logger.info(res.data);
}).catch(err => {
  wechatPay.logger.error(err);
});
