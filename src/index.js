'use strict';

const crypto = require('crypto');
const axios = require('axios');
const { nanoid } = require('nanoid');
const WechatPayError = require('./error');

class WechatPay {
  constructor(config) {
    const error = WechatPayError;
    const logger = console;
    const http = axios;
    http.defaults.baseURL = 'https://api.mch.weixin.qq.com';
    http.defaults.headers.post['Content-Type'] = 'application/json';
    this.config = {
      authorizationType: 'WECHATPAY2-SHA256-RSA2048',
      signAlgorithm: 'RSA-SHA256',
      signEncode: 'base64',
      error,
      logger,
      http,
      ...config,
    };
    this.logger = this.config.logger;
    this.error = this.config.error;
    this.http = this.config.http;
  }

  nonceStr() {
    return nanoid();
  }

  timestamp() {
    return Math.ceil(Date.now() / 1000);
  }

  createSign(data, privateKey) {
    const { signAlgorithm, signEncode } = this.config;
    const sign = crypto.createSign(signAlgorithm);
    sign.update(data);
    sign.end();
    return sign.sign(privateKey).toString(signEncode);
  }

  verifySign(data, sign, publicKey) {
    const { signAlgorithm, signEncode } = this.config;
    const verify = crypto.createVerify(signAlgorithm);
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, Buffer.from(sign, signEncode));
  }

  /**
   * **获取带签名的参数**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @see https://developers.weixin.qq.com/community/pay/doc/0004ae23130ab8b7b08bc95305f400
   * @param {object} params 请求参数
   * @return {string} 签名字符串
   * @memberof WechatPay
   */
  signature(params) {
    // TODO: upload file meta json
    const { method, url, data } = params;
    const { mchCertKey } = this.config;
    console.log({ mchCertKey });
    const nonce_str = this.nonceStr();
    const timestamp = this.timestamp();
    const dataJSON = (data && data instanceof Object) ? JSON.stringify(data) : '';
    const plain = `${method}\n${url}\n${nonce_str}\n${timestamp}\n${dataJSON}\n`;
    const signature = this.createSign(plain, mchCertKey);
    return { signature, nonce_str, timestamp, plain };
  }

  authorization(params) {
    const { mchId: mchid, authorizationType, mchCertSn: serial_no } = this.config;
    const sign = this.signature(params);
    console.log(sign);
    const { signature, nonce_str, timestamp } = sign;
    const authorization = authorizationType + ' ' + [
      `mchid="${mchid}"`,
      `nonce_str="${nonce_str}"`,
      `timestamp="${timestamp}"`,
      `serial_no="${serial_no}"`,
      `signature="${signature}"`,
    ].join();
    return authorization;
  }

  /**
   * **处理支付结果通知**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_5.shtml
   * @param {string} data 微信支付结果通知
   * @return {object} 带响应信息的处理结果
   * @memberof WechatPay
   */
  async callback(data) {
    // TODO: 处理支付通知
    return data;
  }
}

module.exports = WechatPay;
