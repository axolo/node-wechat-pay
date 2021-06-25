'use strict';

const crypto = require('crypto');
const axios = require('axios');
const { nanoid } = require('nanoid');
const WechatPayError = require('./error');

class WechatPay {
  constructor(config) {
    const baseUrl = 'https://api.mch.weixin.qq.com';
    const error = WechatPayError;
    const logger = console;
    const cache = {};
    const http = axios;
    http.defaults.baseURL = baseUrl;
    http.defaults.headers.post['Content-Type'] = 'application/json';
    http.interceptors.request.use(config => {
      const { method, url, data } = config;
      const authorization = this.authorization({ method: method.toUpperCase(), url, data });
      config.headers.Authorization = authorization;
      return config;
    }, error => {
      return Promise.reject(error);
    });
    http.interceptors.response.use(response => {
      // return response?.data || response;
      return response;
    }, error => {
      if (error.isAxiosError) {
        const { data } = error.response;
        const err = new this.error(data.message, data);
        return Promise.reject(err);
      }
      return Promise.reject(error);
    });
    this.config = {
      authorizationSchema: 'WECHATPAY2-SHA256-RSA2048',
      signAlgorithm: 'RSA-SHA256', // sha256WithRSAEncryption
      signEncode: 'base64',
      baseUrl,
      error,
      logger,
      cache,
      http,
      ...config,
    };
    this.logger = this.config.logger;
    this.error = this.config.error;
    this.http = this.config.http;
    this.cache = this.config.cache;
  }

  nonceStr() {
    return nanoid();
  }

  timeStamp() {
    return Math.round(Date.now() / 1000).toString();
  }

  createSign(data, privateKey) {
    const { signAlgorithm, signEncode } = this.config;
    const sign = crypto.createSign(signAlgorithm).update(data).end();
    return sign.sign(privateKey).toString(signEncode);
  }

  verifySign(data, sign, publicKey) {
    const { signAlgorithm, signEncode } = this.config;
    const verify = crypto.createVerify(signAlgorithm).update(data).end();
    return verify.verify(publicKey, Buffer.from(sign, signEncode));
  }

  /**
   * **获取带签名的参数**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay7_1.shtml
   * @param {object} params 请求参数
   * @return {string} 签名字符串
   * @memberof WechatPay
   */
  signature(params) {
    const { method, url, data } = params;
    const dataRaw = (data && data instanceof Object) ? JSON.stringify(data) : '';
    // TODO: upload file meta json
    // if (method == 'POST' || method == 'PUT' || method == 'PATCH') {
    //   var data = pm.request.body.raw;
    //   if (canonicalUrl.endsWith('upload')) {
    //     var result = JSON.parse(JSON.stringify(pm.request.body.formdata));
    //     for (var i in result) {
    //       if (result[i].key == 'meta') {
    //         data = result[i].value;
    //       }
    //     }
    //   }
    // }
    const { mchCertKey } = this.config;
    const nonce_str = this.nonceStr();
    const timestamp = this.timeStamp();
    const plain = `${method}\n${url}\n${timestamp}\n${nonce_str}\n${dataRaw}\n`;
    const signature = this.createSign(plain, mchCertKey);
    return { signature, nonce_str, timestamp, plain };
  }

  authorization(params) {
    const { mchId: mchid, authorizationSchema, mchCertSn: serial_no } = this.config;
    const sign = this.signature(params);
    const { signature, nonce_str, timestamp } = sign;
    const authorization = `${authorizationSchema} `
      + `mchid="${mchid}",`
      + `nonce_str="${nonce_str}",`
      + `timestamp="${timestamp}",`
      + `serial_no="${serial_no}",`
      + `signature="${signature}"`;
    return authorization;
  }

  paySign(payPackage, signType = 'RSA') {
    const { appId, mchCertKey } = this.config;
    const nonceStr = this.nonceStr();
    const timeStamp = this.timeStamp();
    const plain = `${appId}\n${timeStamp}\n${nonceStr}\n${payPackage}\n`;
    const paySign = this.createSign(plain, mchCertKey);
    const sign = { appId, timeStamp, nonceStr, package: payPackage, signType, paySign };
    return sign;
  }

  /**
   * **处理支付结果通知**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_5.shtml
   * @param {string} data 微信支付结果通知
   * @return {object} 带响应信息的处理结果
   * @memberof WechatPay
   */
  async notify(data) {
    // TODO: 处理支付通知
    return data;
  }
}

module.exports = WechatPay;
