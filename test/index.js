'use strict';

const WechatPay = require('../src');
const wechatPay = new WechatPay({ test: true });

wechatPay.logger(wechatPay);
