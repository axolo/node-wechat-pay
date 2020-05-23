'use strict';

const { snakify } = require('camelsnake');
const WechatPay = require('../src');

const { baseUrl, appId: appid, mchId, mchKey, notifyUrl, openid } = process.env;
const config = { baseUrl, appid, mchId, mchKey, notifyUrl };
const wechatPay = new WechatPay(config);

// convert camle case to snake case
const data = snakify({
  appid,
  mchId,
  notifyUrl,
  openid,
  nonceStr: wechatPay.nonceStr(),
  tradeType: 'JSAPI',
  deviceInfo: 'DEVICE_INFO',
  body: '微信交易（wechat trade）',
  totalFee: 1,
  spbillCreateIp: '127.0.0.1',
  outTradeNo: 'DD' + Date.now(),
});
// see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1
wechatPay.execute('/pay/unifiedorder', {
  data,
}).then(result => {
  console.log(result);
  if (result.return_code !== 'SUCCESS' || result.result_code !== 'SUCCESS') {
    console.log(result);
    return;
  }
  // build `wx.requestPayment()` params
  // see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html
  // see https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3
  const params = {
    timeStamp: Math.floor(Date.now() / 1000).toString(),
    nonceStr: wechatPay.nonceStr(),
    package: [ 'prepay_id', result.prepay_id ].join('='),
    signType: data.signType || 'MD5',
  };
  const paySign = wechatPay.sign({ appId: result.appid, ...params });
  const requestPayment = { ...params, paySign };
  console.log(requestPayment);
  // call `wx.requestPayment(requestPayment)` in wechat miniprogram or official account
}).catch(error => {
  console.log(error);
});
