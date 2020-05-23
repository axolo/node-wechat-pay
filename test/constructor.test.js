'use strict';

const WechatPay = require('../src');

const { baseUrl, appId, appSecret } = process.env;
const config = { baseUrl, appId, appSecret };
const wechatPay = new WechatPay(config);

console.log(wechatPay);
